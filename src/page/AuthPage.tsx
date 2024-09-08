import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Typo from '../components/Typo';
import LocalImage from '../components/LocalImage';
import CustomButton from '../components/Button';

function AuthPage(): JSX.Element {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const pressSignupBtn = () => {
    setSignupModalVisible(true);
    console.log('Signup', name, phoneNumber);
  };

  const pressLoginBtn = () => {
    setLoginModalVisible(true);
  };

  const closeModal = () => {
    setSignupModalVisible(false);
    setLoginModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <LocalImage
        localAsset={require('../assets/logo.png')}
        width={100}
        height={100}
      />
      <Typo color="black" fontSize={20} style={styles.text}>
        로그인 및 회원가입 페이지
      </Typo>

      <CustomButton onPress={pressSignupBtn}>
        <Typo color="black" fontSize={20}>
          회원가입
        </Typo>
      </CustomButton>

      <CustomButton onPress={pressLoginBtn}>
        <Typo color="black" fontSize={20}>
          로그인
        </Typo>
      </CustomButton>

      <Typo color="gray" fontSize={16}>
        이미 아이디가 있으신가요?
      </Typo>

      {/* 회원가입 Modal */}
      <Modal
        animationType="slide" // 애니메이션 효과 설정 (선택 사항)
        transparent={true} // 배경 투명하게 설정
        visible={isSignupModalVisible}
        onRequestClose={closeModal} // Android에서 뒤로가기 버튼 처리
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="닉네임"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="전화번호를 적어주세요."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <CustomButton
            onPress={() => {
              // TODO: Signup API 호출
              console.log('Signup', name, phoneNumber);
              // closeModal();
            }}>
            <Typo color="black" fontSize={20}>
              회원가입 완료
            </Typo>
          </CustomButton>
        </View>
      </Modal>

      {/* 로그인 Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginModalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="전화번호를 적어주세요."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <CustomButton
            onPress={() => {
              // TODO: Login API 호출
              console.log('Login', phoneNumber);
              // closeModal();
            }}>
            <Typo color="black" fontSize={20}>
              로그인
            </Typo>
          </CustomButton>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {},
  text: {
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 흐리게 처리
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Android 그림자 효과
  },
});

export default AuthPage;
