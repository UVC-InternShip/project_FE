import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Typo from '../components/Typo';
import CustomButton from '../components/Button';
import {NavigationProp} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {isLoggedInAtom} from '../store/atom/auth';
import axios from 'axios';
import {API_URL} from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignupPageProps {
  navigation: NavigationProp<any>;
  isNavigatorReady: boolean;
}
function SignupPage({
  navigation,
  isNavigatorReady,
}: SignupPageProps): JSX.Element {
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
      await axios
        .post(`${baseUrl}/sms/verify-code`, {
          phoneNumber: phoneNumber,
          code: authCode,
        })
        .then(res => {
          if (res.data.success === true) {
            AsyncStorage.setItem('isLogin', 'true');
            AsyncStorage.setItem('userinfo', JSON.stringify(res.data.user));
            setIsLogin(true);
            navigation.navigate('Main');
          } else {
            setIsCodeConfirmed(true);
          }
        });
    } catch (error) {
      console.error('Error verifying auth code:', error);
    }
    // setIsCodeConfirmed(true);
  };

  const pressSingUp = async () => {
    try {
      await axios
        .post(`${baseUrl}/users/register`, {
          phoneNumber: phoneNumber,
          name: nickname,
        })
        .then(res => {
          AsyncStorage.setItem('isLogin', 'true');
          setIsLogin(true);
          navigation.navigate('Main');
        });
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
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typo color="black" fontSize={20}>
          안녕하세요!
        </Typo>
        <Typo color="black" fontSize={20}>
          휴대폰 번호를 입력해주세요.
        </Typo>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="휴대폰 번호 (숫자만 입력)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
      </View>

      <CustomButton
        onPress={pressSendBtn}
        style={styles.button}
        disabled={!activateBtn}>
        <Typo color={activateBtn ? 'black' : '#919191'} fontSize={16}>
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
            <Typo color="black" fontSize={16}>
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
          <CustomButton onPress={pressSingUp} style={styles.button}>
            <Typo color="black" fontSize={16}>
              회원가입
            </Typo>
          </CustomButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  textContainer: {
    paddingTop: 16,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    height: 50,
  },
  button: {
    width: '100%',
    borderWidth: 1,
    marginTop: 16,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
  },
});

export default SignupPage;
