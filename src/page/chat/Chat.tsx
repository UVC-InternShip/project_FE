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
interface IChatProps {
  navigation: NavigationProp<any>;
}
function Chat({navigation}: IChatProps): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('교환');
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [filteredChatRooms, setFilteredChatRooms] = useState<any[]>([]);
  const [userID, setUserID] = useState<number>();
  const fetchChatList = async () => {
    try {
      const userinfo = await AsyncStorage.getItem('userinfo');
      const userId = JSON.parse(userinfo!).userId;
      setUserID(userId); // userId 세��
      const response = await axios.get(`${API_URL}/chat/list?userId=${userId}`);
      console.log(response.data.chatRooms.length);
      console.log('나눔 아이템 구조', response.data.chatRooms[0].items);
      console.log('교환 아이템 구조', response.data.chatRooms[3].items);
      if (response.status === 200) {
        setChatRooms(response.data.chatRooms);
        filterChatRooms(response.data.chatRooms, selectedTab);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const filterChatRooms = (rooms: any[], tab: string) => {
    const filteredRooms = rooms.filter(room => {
      if (Array.isArray(room.items)) {
        // items가 배열일 때 (교환의 경우)
        return room.items.some((item: any) => item.purpose === tab);
      } else {
        // items가 단일 객체일 때 (나눔의 경우)
        return room.items.purpose === tab;
      }
    });
    setFilteredChatRooms(filteredRooms);
  };
  useEffect(() => {
    fetchChatList();
  }, []);
  useEffect(() => {
    filterChatRooms(chatRooms, selectedTab); // 탭 변경 시 필터링
  }, [selectedTab, chatRooms]);
  // useEffect(() => {

  // }, []);

  // const moveChatRoom = async (room: any) => {
  //   try {
  //     const response = await axios.get(`${API_URL}/chat/detail/${room._id}`);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const moveChatRoom = (chatRoomId: number) => {
    navigation.navigate('ChatRoom', {userId: userID, chatRoomId: chatRoomId}); // userId, chatRoomId를 navigationParams로 전��
  };

  console.log('chatRooms:', chatRooms);
  const renderItem = ({item}: any) => {
    const chatItems = Array.isArray(item.items) ? item.items : [item.items]; // 교환의 경우 배열, 나눔은 단일 객체

    return chatItems.map((chatItem: any) => (
      <TouchableOpacity
        key={chatItem.id}
        style={styles.itemContainer}
        onPress={() => moveChatRoom(item.id)} // room.id를 사용하여 채팅방으로 이동
      >
        <Text style={styles.title}>{chatItem.title}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()} {/* 날짜 형식화 */}
        </Text>
        <Text style={styles.status}>{chatItem.status}</Text>
      </TouchableOpacity>
    ));
  };
  return (
    <View style={styles.container}>
      {/* 탭 UI */}
      <View style={styles.tabContainer}>
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
      </View>

      <FlatList
        data={filteredChatRooms}
        renderItem={renderItem}
        keyExtractor={item => item.id} // 고유 ID 사용
      />
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
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  status: {
    fontSize: 14,
    color: 'blue',
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
});

export default Chat;
