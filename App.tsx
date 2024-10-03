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
import SearchPage from './src/page/search/Search';
import SplashScreen from 'react-native-splash-screen';
import Transaction from './src/page/profile/Transaction';
import modifyUserInfo from './src/page/profile/ModifyUserInfo';
import MyPoint from './src/page/profile/MyPoint';
import Reputation from './src/page/profile/Reputation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom} from 'jotai';
import {isLoggedInAtom} from './src/store/atom/auth';
import SplashScreenPage from './src/page/SplashScreen';
import AuthPage from './src/page/auth/AuthPage';
import SignupPage from './src/page/auth/SignupPage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProductRegisterPage from './src/page/product/ProductRegisterPage';
import ProductDetailPage from './src/page/product/ProductDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from './config';
import ChatRoom from './src/page/chat/ChatRoom';
import MainHeader from './src/components/header/MainHeader';

const Stack = createNativeStackNavigator();

interface IToken {
  accessToken: string;
  refreshToken: string;
}
export default function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useAtom(isLoggedInAtom);

  const [isNavigatorReady, setIsNavigatorReady] = useState(false);
  const navigatorRef = useRef(null);
  const queryClient = new QueryClient();

  const getLoginStatus = useCallback(async () => {
    const res = await AsyncStorage.getItem('isLogin');
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const result = await checkDBUser(JSON.parse(token!));
      if (res === 'true' && result === true) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    }
  }, [setIsLogin]);

  const checkDBUser = async (token: IToken) => {
    try {
      const response = await axios.post(`${API_URL}/token/validate-token`, {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
      if (response.data.valid === true) {
        console.log('유효함.');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking DB user:', error);
    }
  };

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
                  header: ({navigation}) => <MainHeader navigation={navigation} logout={logout} />,
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
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            // options={{
            //   headerShown: false,
            // }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
