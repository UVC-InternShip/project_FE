// import {NavigationProp} from '@react-navigation/native';
// import React, {useEffect, useState} from 'react';
// import {StyleSheet, TextInput, View} from 'react-native';
// import Typo from '../components/Typo';
// import CustomButton from '../components/Button';
// import {isLoggedInAtom} from '../store/atom/auth';
// import {useAtom} from 'jotai';
// import axios from 'axios';
// import { API_URL } from '../../config';

// interface SigninPageProps {
//   navigation: NavigationProp<any>;
//   isNavigatorReady: boolean;
// }
// function SigninPage({
//   navigation,
//   isNavigatorReady,
// }: SigninPageProps): JSX.Element {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [activateBtn, setActivateBtn] = useState(false);
//   const [isSendClicked, setIsSendClicked] = useState(false);
//   const [authCode, setAuthCode] = useState('');
//   const [isLogin, setIsLogin] = useAtom(isLoggedInAtom);
//   const [isFailLogin, setIsFailLogin] = useState(false);
//   const baseUrl = API_URL;
//   const pressSendBtn = async () => {
//     // 핸드폰 번호 인증 api 요청
//     try {
//       await axios
//         .post(`${baseUrl}/sms/send-verification`, {
//           phoneNumber: phoneNumber,
//         })
//         .then(res => {
//           setIsSendClicked(true);
//         });
//     } catch (error) {
//       console.error('Error sending SMS:', error);
//     }
//   };

//   useEffect(() => {
//     setActivateBtn(phoneNumber.length >= 10);
//   }, [phoneNumber]);

//   const checkCodeAndSignin = () => {
//     console.log('로그인 시도');
//     setIsLogin(true);
//     // setIsCodeConfirmed(true);
//     // 실제 로직은 이 버튼을 클릭하게 되면 api 요청이 발생한다.
//     // 응답으로 Ok 가 오면 setIsLogin(true)를 호출한다.
//     // 실패하면 에러 메시지를 보여준다.
//     // setIsFailLogin(true);
//   };

//   useEffect(() => {
//     if (isNavigatorReady && isLogin) {
//       navigation.navigate('Main');
//     }
//   }, [isNavigatorReady, isLogin, navigation]);
//   return (
//     <View style={styles.container}>
//       <View style={styles.textContainer}>
//         <Typo color="black" fontSize={20}>
//           안녕하세요!
//         </Typo>
//         <Typo color="black" fontSize={20}>
//           휴대폰 번호를 입력해주세요.
//         </Typo>
//       </View>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="휴대폰 번호 (숫자만 입력)"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           keyboardType="number-pad"
//         />
//       </View>
//       <CustomButton
//         onPress={pressSendBtn}
//         style={styles.button}
//         disabled={!activateBtn}>
//         <Typo color={activateBtn ? 'black' : '#919191'} fontSize={16}>
//           인증번호 받기
//         </Typo>
//       </CustomButton>
//       {isSendClicked && (
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="인증 번호 입력"
//             value={authCode}
//             onChangeText={setAuthCode}
//             keyboardType="number-pad"
//           />
//           <CustomButton onPress={checkCodeAndSignin} style={styles.button}>
//             <Typo color="black" fontSize={16}>
//               인증번호 확인
//             </Typo>
//           </CustomButton>
//         </View>
//       )}
//       {/* {isFailLogin && (
//         <Typo color='red' fontSize={16}>
//           비밀번호가 일치하지 않습니다.
//         </Typo>
//       )} */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//   },
//   textContainer: {
//     paddingTop: 16,
//   },
//   inputContainer: {
//     marginTop: 16,
//   },
//   input: {
//     width: '100%',
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 10,
//     height: 50,
//   },
//   button: {
//     width: '100%',
//     borderWidth: 1,
//     marginTop: 16,
//     borderColor: 'gray',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     height: 50,
//   },
// });

// export default SigninPage;
