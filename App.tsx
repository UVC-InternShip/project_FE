import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/router/TabNav';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchPage from './src/page/Search';
import SplashScreen from 'react-native-splash-screen';
import {useAtom} from 'jotai';
import {isLoggedInAtom} from './src/store/atom/auth';
import SplashScreenPage from './src/page/SplashScreen';
import AuthPage from './src/page/AuthPage';
import SignupPage from './src/page/SignupPage';
import SigninPage from './src/page/SigninPage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProductRegisterPage from './src/page/ProductRegisterPage';
import ProductDetail from './src/page/ProductDetail'; // ProductDetail 페이지 임포트

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useAtom(isLoggedInAtom);
  const [isNavigatorReady, setIsNavigatorReady] = useState(false);
  const navigatorRef = useRef(null);
  const queryClient = new QueryClient();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      SplashScreen.hide();  // 스플래시 화면을 숨김
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreenPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer
        ref={navigatorRef}
        onReady={() => setIsNavigatorReady(true)}>
        {isLogin ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </QueryClientProvider>
  );
}

// 메인 네비게이터
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={TabNavigator} // TabNavigator를 메인으로 설정
      options={({navigation}) => ({
        headerTitle: '바꾸자고',
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <Icon.Button
              onPress={() => navigation.navigate('Search')}
              name="search"
              backgroundColor="transparent"
              color="#000"
            />
            <Icon.Button
              onPress={() => console.log('알림 버튼 클릭')}
              name="notifications"
              backgroundColor="transparent"
              color="#000"
            />
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="ProductRegister"
      component={ProductRegisterPage}
      options={{title: '물건 등록'}}
    />
    <Stack.Screen
      name="Search"
      component={SearchPage}
      options={{title: '검색'}}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetail}  // ProductDetail 페이지 추가
      options={{title: '상품 상세 정보'}}
    />
  </Stack.Navigator>
);

// 인증 네비게이터
const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Auth"
      component={AuthPage}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Signup"
      component={SignupPage}
      options={{title: '회원가입'}}
    />
    <Stack.Screen
      name="Signin"
      component={SigninPage}
      options={{title: '로그인'}}
    />
  </Stack.Navigator>
);
