import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

function SigninPage(): JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <View>
      <TextInput
        placeholder="전화 번호"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      {/* Signup Button */}
      {/* Signup Success Alert */}
    </View>
  );
}

export default SigninPage;
