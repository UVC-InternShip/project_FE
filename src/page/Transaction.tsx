import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';

function Transaction(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('물물교환');

  // 물물교환 리스트 예시 데이터
  const tradeItems = [
    { id: '1', name: '맥북 2021년형', status: '교환 완료' },
    { id: '2', name: '맥북 2021년형', status: '제안 중' },
    { id: '3', name: '맥북 2021년형', status: '제안 중' },
  ];

  // 나눔 리스트 예시 데이터
  const donationItems = [
    { id: '1', name: '맥북 2021년형', status: '나눔 완료' },
  ];

  // 리스트 아이템을 렌더링하는 함수
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.itemImage} source={{ uri: 'https://via.placeholder.com/50' }} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <View style={styles.itemStatusContainer}>
        <Text style={[styles.itemStatus, item.status.includes('완료') && styles.itemStatusCompleted]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 헤더
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 판매 기록</Text>
      </View> */}

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '물물교환' && styles.activeTab]}
          onPress={() => setSelectedTab('물물교환')}
        >
          <Text style={[styles.tabText, selectedTab === '물물교환' && styles.activeTabText]}>물물교환</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '나눔' && styles.activeTab]}
          onPress={() => setSelectedTab('나눔')}
        >
          <Text style={[styles.tabText, selectedTab === '나눔' && styles.activeTabText]}>나눔</Text>
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <FlatList
        data={selectedTab === '물물교환' ? tradeItems : donationItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  list: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemStatusContainer: {
    width: 80,
    alignItems: 'center',
  },
  itemStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  itemStatusCompleted: {
    backgroundColor: 'black',
    color: 'white',
  },
});

export default Transaction;
