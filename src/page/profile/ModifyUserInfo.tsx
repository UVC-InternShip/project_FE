import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {API_URL} from '../../../config';

type RootStackParamList = {
  Profile: {updatedProfile?: {userId: number; name: string}};
  ModifyUserInfo: {userProfile: {userId: number; name: string}};
};

type ModifyUserInfoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ModifyUserInfo'>;
type ModifyUserInfoRouteProp = RouteProp<RootStackParamList, 'ModifyUserInfo'>;

function ModifyUserInfo(): JSX.Element {
  const navigation = useNavigation<ModifyUserInfoNavigationProp>();
  const route = useRoute<ModifyUserInfoRouteProp>();
  const {userProfile} = route.params;

  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleComplete} disabled={isLoading}>
          <Text style={[styles.headerButton, isLoading && styles.disabledButton]}>
            {isLoading ? '처리 중...' : '수정'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, nickname, isLoading]);

  const handleComplete = async () => {
    const newNickname = nickname.trim() || userProfile.name;
    if (newNickname === userProfile.name) {
      Alert.alert('알림', '변경할 새로운 닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`${API_URL}/users/update-name/${userProfile.userId}`, {
        newName: newNickname,
      });

      if (response.status === 200) {
        Alert.alert('성공', `닉네임이 '${newNickname}'으로 변경되었습니다.`, [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('Profile', {
                updatedProfile: {...userProfile, name: newNickname},
              });
            },
          },
        ]);
      } else {
        throw new Error('서버 응답이 성공이 아닙니다.');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      Alert.alert('오류', '닉네임 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder={userProfile.name}
          placeholderTextColor="#999"
          value={nickname}
          onChangeText={setNickname}
          editable={!isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  headerButton: {
    fontSize: 16,
    color: '#007AFF',
    marginHorizontal: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ModifyUserInfo;
