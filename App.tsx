/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/router/TabNav';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchPage from './src/page/Search';
import SplashScreen from 'react-native-splash-screen';
import Transaction from './src/page/Transaction';
import modifyUserInfo from './src/page/ModifyUserInfo';
import MyPoint from './src/page/MyPoint';
import Reputation from './src/page/Reputation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom} from 'jotai';
import {isLoggedInAtom} from './src/store/atom/auth';
import SplashScreenPage from './src/page/SplashScreen';
import AuthPage from './src/page/AuthPage';
import SignupPage from './src/page/SignupPage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProductRegisterPage from './src/page/ProductRegisterPage';
import ProductDetailPage from './src/page/ProductDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useAtom(isLoggedInAtom);

  const [isNavigatorReady, setIsNavigatorReady] = useState(false);
  const navigatorRef = useRef(null);
  const queryClient = new QueryClient();

  const getLoginStatus = useCallback(async () => {
    const res = await AsyncStorage.getItem('isLogin');
    console.log('res', res);
    setIsLogin(res === 'true');
  }, [setIsLogin]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      SplashScreen.hide();
    }, 2000);
  }, []);

  useEffect(() => {
    getLoginStatus();
  }, [getLoginStatus]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('isLogin');
      await AsyncStorage.removeItem('userinfo');
      setIsLogin(false);
    } catch (error) {
      console.error('Error removing login status:', error);
    }
  };

  if (isLoading) {
    return <SplashScreenPage />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigatorRef} onReady={() => setIsNavigatorReady(true)}>
        <Stack.Navigator>
          {isLogin ? (
            <>
              <Stack.Screen
                name="Main"
                component={TabNavigator}
                options={{
                  header: ({navigation}) => (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{flex: 1, textAlign: 'center'}}>바꾸자고</Text>
                      <Icon.Button
                        onPress={() => navigation.navigate('Search')}
                        name="search"
                        backgroundColor={'#fff'}
                        color={'#000'}
                      />
                      <Icon.Button
                        onPress={() => console.log('This is a button!')}
                        name="notifications"
                        backgroundColor={'#fff'}
                        color={'#000'}
                      />
                      <Icon.Button
                        onPress={logout}
                        name="log-out-outline"
                        backgroundColor={'#fff'}
                        color={'#000'}
                      />
                    </View>
                  ),
                }}
              />
            </>
          ) : (
            <Stack.Screen name="Auth" component={AuthPage} options={{headerShown: false}} />
          )}
          <Stack.Screen name="Signup">
            {props => <SignupPage {...props} isNavigatorReady={isNavigatorReady} />}
          </Stack.Screen>
          <Stack.Screen name="Search" component={SearchPage} />
          <Stack.Screen name="ProductRegister" component={ProductRegisterPage} />
          <Stack.Screen
            name="modifyUserInfo"
            component={modifyUserInfo}
            options={{title: '프로필 수정'}}
          />
          <Stack.Screen name="Transaction" component={Transaction} options={{title: '나의 활동'}} />
          <Stack.Screen name="MyPoint" component={MyPoint} options={{title: '내 포인트'}} />
          <Stack.Screen name="Reputation" component={Reputation} options={{title: '받은 평가'}} />
          <Stack.Screen name="ProductDetail" component={ProductDetailPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
