import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import CustomButton from '../components/Button';
import Typo from '../components/Typo';
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config';

interface ProfilePageProps {
  navigation: NavigationProp<any>;
}

interface UserProfile {
  userId: number;
  name: string;
  reputationScore: number;
  pointEarned: number;
}

function Profile({navigation}: ProfilePageProps): JSX.Element {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // useEffect(() => {
  //   if (route.params?.updatedProfile) {
  //     setUserProfile(route.params.updatedProfile);
  //   }
  // }, [route.params?.updatedProfile]);

  // TODO : AsyncStorage에 존재하는 userinfo를 가져와서 userProfile state update
  const fetchUserProfile = async () => {
    try {
      const userId = 1;
      const response = await axios.get(`${API_URL}/users/profile/${userId}`);
      setUserProfile(response.data);
      setLoading(false);
    } catch (err) {
      setError('사용자 정보를 불러오는데 실패했습니다.');
      setLoading(false);
      console.error('Error fetching user profile:', err);
    }
  };
  const modifyUserInfo = () => {
    if (userProfile) {
      navigation.navigate('modifyUserInfo', {userProfile});
    } else {
      Alert.alert('오류', '사용자 정보를 불러오지 못했습니다.');
    }
  };

  const Transaction = () => {
    console.log('나의 활동');
    navigation.navigate('Transaction');
  };

  const myPoint = () => {
    navigation.navigate('MyPoint');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>프로필</Text>
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>이름: {userProfile?.name || '이름 없음'}</Text>
        <Text style={styles.profileName}>Point: {userProfile?.pointEarned || '0'}</Text>
      </View>

      {/* 프로필 수정 버튼 */}
      <View style={styles.modify}>
        <CustomButton style={styles.modifyButtonContainer} onPress={modifyUserInfo}>
          <Typo color="black" fontSize={16} style={styles.modifyButtonText}>
            프로필 수정
          </Typo>
        </CustomButton>
      </View>

      {/* 평판 확인 */}
      <View style={styles.reputationSection}>
        <Text style={styles.profileName}>평판점수: {userProfile?.reputationScore || '0'}점</Text>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menu}>
        <CustomButton style={styles.menuButtonContainer} onPress={Transaction}>
          <Typo color="black" fontSize={16} style={styles.menuText}>
            나의 활동
          </Typo>
        </CustomButton>
        <CustomButton style={styles.menuButtonContainer} onPress={myPoint}>
          <Typo color="black" fontSize={16} style={styles.menuText}>
            포인트 사용 내역
          </Typo>
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modify: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  modifyButtonContainer: {
    width: '90%',
    height: 45,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#eee',
    borderColor: 'gray',
    marginBottom: 10,
  },
  modifyButtonText: {
    fontWeight: 'bold',
  },
  menu: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuButtonContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 15,
    justifyContent: 'center',
  },
  menuText: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reputationSection: {
    marginStart: 10,
  },
});

export default Profile;
