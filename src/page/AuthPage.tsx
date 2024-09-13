import React from 'react';
import {StyleSheet, View} from 'react-native';
import Typo from '../components/Typo';
import LocalImage from '../components/LocalImage';
import CustomButton from '../components/Button';
import {NavigationProp} from '@react-navigation/native';

interface AuthPageProps {
  navigation: NavigationProp<any>;
}

function AuthPage({navigation}: AuthPageProps): JSX.Element {
  const pressSignupBtn = () => {
    console.log('Signup');
    navigation.navigate('Signup');
  };

  // const pressLoginBtn = () => {
  //   console.log('Login');
  //   navigation.navigate('Signin');
  // };
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <LocalImage
          localAsset={require('../assets/logo.png')}
          width={100}
          height={100}
        />
        <Typo color="black" fontSize={20} style={styles.text}>
          필요없는 물건이 있나요?
        </Typo>
        <Typo color="black" fontSize={20} style={styles.text}>
          있다면 우선 등록하세요!
        </Typo>
      </View>
      <View style={styles.bottomContainer}>
        <CustomButton onPress={pressSignupBtn}>
          <Typo color="black" fontSize={20}>
            본인인증하기
          </Typo>
        </CustomButton>
        {/* <Typo color="black" fontSize={16} style={styles.text}>
          이미 회원이신가요?
          <CustomButton onPress={pressLoginBtn}>
            <Typo color="blue" fontSize={16}>
              로그인
            </Typo>
          </CustomButton>
        </Typo> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {},

  text: {
    marginTop: 10,
    height: 40, // 텍스트 높이 설정
    lineHeight: 40, // 텍스트 높이 설정
  },

  titleText: {},
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AuthPage;
