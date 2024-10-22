import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/Button';
import {NavigationProp} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {isLoggedInAtom} from '../../store/atom/auth';
import axios from 'axios';
import {API_URL} from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalImage from '../../components/common/LocalImage';

interface SignupPageProps {
  navigation: NavigationProp<any>;
  isNavigatorReady: boolean;
}
function SignupPage({navigation, isNavigatorReady}: SignupPageProps): JSX.Element {
  // const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activateBtn, setActivateBtn] = useState(false);
  const [isSendClicked, setIsSendClicked] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [nickname, setNickname] = useState('');
  // const setIsLogin = useSetAtom(isLoggedInAtom);
  const [isLogin, setIsLogin] = useAtom(isLoggedInAtom);
  const baseUrl = API_URL;
  // const navigator = useNavigation();

  // 회원가입 버튼을 누르거나 인증코드 확인 시 이미 가입한 회원인 경우, asyncStorage에 로그인 여부 true로 저장.

  const pressSendBtn = async () => {
    // 핸드폰 번호 인증 api 요청
    try {
      await axios
        .post(`${baseUrl}/sms/send-verification`, {
          phoneNumber: phoneNumber,
        })
        .then(res => {
          setIsSendClicked(true);
        });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  useEffect(() => {
    setActivateBtn(phoneNumber.length >= 10);
  }, [phoneNumber]);

  const checkAuthCode = async () => {
    try {
      const response = await axios.post(`${baseUrl}/sms/verify-code`, {
        phoneNumber: phoneNumber,
        code: authCode,
      });
      if (response.data.success === true) {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
        console.log('유저정보 형식', response.data.user);
        await AsyncStorage.setItem('userinfo', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('isLogin', 'true');
        await AsyncStorage.setItem('token', JSON.stringify(tokens));
        setIsLogin(true);
        navigation.navigate('Main');
      } else {
        setIsCodeConfirmed(true);
      }
    } catch (error) {
      console.error('Error verifying auth code:', error);
    }
    // setIsCodeConfirmed(true);
  };

  const pressSingUp = async () => {
    try {
      const response = await axios.post(`${baseUrl}/users/register`, {
        phoneNumber: phoneNumber,
        name: nickname,
      });
      if (response.data.accessToken && response.data.refreshToken) {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
        await AsyncStorage.setItem('userinfo', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('isLogin', 'true');
        await AsyncStorage.setItem('token', JSON.stringify(tokens));
        setIsLogin(true);
        navigation.navigate('Main');
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  useEffect(() => {
    if (isNavigatorReady && isLogin) {
      navigation.navigate('Main');
    }
  }, [isNavigatorReady, isLogin, navigation]);
  return (
    <View style={styles.outerContainer}>
      <View style={styles.topContainer}>
        <View style={styles.textContainer}>
          <Typo color="black" fontSize={22} style={styles.text}>
            안녕하세요!
          </Typo>
          <Typo color="black" fontSize={22} style={styles.text}>
            휴대폰 번호를 입력해주세요.
          </Typo>
          <Typo color="black" fontSize={14} style={styles.subText}>
            본인 인증을 진행 해주세요.
          </Typo>
        </View>
        <View style={styles.imgContainer}>
          <LocalImage localAsset={require('../../assets/banana.png')} width={150} height={100} />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="휴대폰 번호"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
        </View>

        <CustomButton onPress={pressSendBtn} style={styles.button} disabled={!activateBtn}>
          <Typo color={activateBtn ? 'black' : '#606a74'} fontSize={15} style={styles.buttonText}>
            인증번호 받기
          </Typo>
        </CustomButton>
        {isSendClicked && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="인증 번호 입력"
              value={authCode}
              onChangeText={setAuthCode}
              keyboardType="numeric"
            />
            <CustomButton onPress={checkAuthCode} style={styles.button}>
              <Typo color="black" fontSize={15}>
                인증번호 확인
              </Typo>
            </CustomButton>
          </View>
        )}
        {isCodeConfirmed && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력하세요."
              value={nickname}
              onChangeText={setNickname}
            />
            <CustomButton onPress={pressSingUp} style={styles.signupButton}>
              <Typo color="black" fontSize={15} style={styles.signupText}>
                회원가입
              </Typo>
            </CustomButton>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  topContainer: {
    flex: 1,
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 500,
    lineHeight: 30,
  },
  subText: {
    fontWeight: 500,
    color: '#9BA1AA',
    marginTop: 5,
  },
  bottomContainer: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E1E3E6',
    color: 'black',
    borderRadius: 6,
    height: 50,
  },
  button: {
    width: '100%',
    backgroundColor: '#f2f4f6',
    marginTop: 16,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 50,
  },
  buttonText: {
    lineHeight: 20,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#FDEE55',
    marginTop: 16,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 50,
  },
  signupText: {
    lineHeight: 20,
    color: '#1a1b1f',
  },
});

export default SignupPage;
