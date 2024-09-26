import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// CHECKLIST
// DESC 1. 채팅 리스트에 대한 페이지.
// DESC 2. 물물교환 채팅 탭과 나눔 채팅 탭이 있어야 한다.
//

function Chat(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('교환');

  const renderItems = () => {
    return (
      <View>
        <Text>채팅 리스트</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
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
});

export default Chat;
