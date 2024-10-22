import React from 'react';
import {StyleSheet, View} from 'react-native';
import Typo from '../../components/common/Typo';
import LocalImage from '../../components/common/LocalImage';
import CustomButton from '../../components/common/Button';
import {NavigationProp} from '@react-navigation/native';

interface AuthPageProps {
  navigation: NavigationProp<any>;
}

function AuthPage({navigation}: AuthPageProps): JSX.Element {
  const pressSignupBtn = () => {
    console.log('Signup');
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <LocalImage localAsset={require('../../assets/mainImg.png')} width={200} height={200} />
        <View style={styles.textContainer}>
          <Typo color="black" fontSize={22} style={styles.text}>
            필요없는 물건이 있나요?
          </Typo>
          <Typo color="black" fontSize={22} style={styles.text}>
            우선 등록하세요!
          </Typo>
          <Typo color="black" fontSize={14} style={styles.subText}>
            본인 인증을 진행 해주세요.
          </Typo>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <CustomButton onPress={pressSignupBtn} style={styles.button}>
          <Typo color="black" fontSize={15} style={styles.font}>
            본인 인증하기
          </Typo>
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 9,
  },
  textContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDEE55',
    borderRadius: 8,
    paddingVertical: 15,
  },
  font: {
    fontWeight: 600,
    lineHeight: 20,
  },
  text: {
    fontWeight: 500,
    lineHeight: 30,
    // marginTop: 10,
    // height: 40, // 텍스트 높이 설정
    // lineHeight: 40, // 텍스트 높이 설정
  },
  subText: {
    fontWeight: 500,
    color: '#9BA1AA',
    marginTop: 5,
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
