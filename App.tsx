/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/router/TabNav';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchPage from './src/page/Search';
import SplashScreen from 'react-native-splash-screen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom} from 'jotai';
import {isLoggedInAtom} from './src/store/atom/auth';
import SplashScreenPage from './src/page/SplashScreen';
import AuthPage from './src/page/AuthPage';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useAtom(isLoggedInAtom);
  useEffect(() => {
    // SplashScreen.show();
    setTimeout(() => {
      // SplashScreen.hide();
      setIsLoading(false);
      SplashScreen.hide();
    }, 2000);
    // 로그인 여부 확인
    // const checkLogin = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem('userToken');
    //     setIsLogin(!!token);
    //   } catch (error) {
    //     // 로그인 실��
    //     setIsLoading(false);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // checkLogin();
  }, []);

  if (isLoading) {
    return <SplashScreenPage />;
  }
  return (
    <NavigationContainer>
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
                  </View>
                ),
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthPage}
            options={{headerShown: false}}
          />
        )}
        <Stack.Screen name="Search" component={SearchPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
