import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {API_URL} from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp} from '@react-navigation/native';

// CHECKLIST
// DESC 1. 채팅 리스트에 대한 페이지.
// DESC 2. 물물교환 채팅 탭과 나눔 채팅 탭이 있어야 한다.
//
interface ChatProps {
  navigation: NavigationProp<any>;
}
function Chat({navigation}: ChatProps): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('교환');
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const fetchChatList = async () => {
    try {
      const userinfo = await AsyncStorage.getItem('userinfo');
      const userID = JSON.parse(userinfo!).userId;
      console.log(userID);
      const response = await axios.get(`${API_URL}/chat/list?userId=${userID}`);
      if (response.status === 200) {
        setChatRooms(response.data.chatRooms);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchChatList();
  }, []);
  // useEffect(() => {

  // }, []);

  // const moveChatRoom = async (room: any) => {
  //   try {
  //     const response = await axios.get(`${API_URL}/chat/detail/${room._id}`);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  console.log('chatRooms:', chatRooms);
  const renderItems = () => {
    return (
      <View>
        {chatRooms.map((room, index) => (
          <TouchableOpacity key={index} style={styles.itemContainer}>
            <Text>{room._id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '교환' && styles.activeTab]}
          onPress={() => setSelectedTab('교환')}>
          <Text style={[styles.tabText, selectedTab === '교환' && styles.activeTabText]}>교환</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '나눔' && styles.activeTab]}
          onPress={() => setSelectedTab('나눔')}>
          <Text style={[styles.tabText, selectedTab === '나눔' && styles.activeTabText]}>나눔</Text>
        </TouchableOpacity>
      </View> */}

      <View>
        <FlatList data={chatRooms} renderItem={renderItems} />
      </View>
    </View>
  );
}

// TODO
// [ ]socket.io 로 채팅 구현
// [ ] 채팅 UI 구현

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: 'black',
  },
  activeTabText: {
    color: 'black',
    fontWeight: 'bold',
  },
  itemContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 16,
  },
});

export default Chat;
