import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

function SignupPage(): JSX.Element {
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <View>
      <TextInput
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      {/* Nickname Check Alert */}

      {/* Phone Number Check Alert */}
      <TextInput
        placeholder="전화번호"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      {/* Signup Button */}
      {/* Signup Success Alert */}
    </View>
  );
}

export default SignupPage;
