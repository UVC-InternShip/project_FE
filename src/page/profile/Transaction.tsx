import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Image} from 'react-native';
import {API_URL} from '../../../config';
import axios from 'axios';
import {NavigationProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IProduct {
  id: string;
  name: string;
  status: string;
  description: string;
  images?: Array<{imageUrl: string}>;
}

interface IContent {
  contentsId: number;
  title: string;
  status: string;
  description: string;
  purpose?: string;
  images?: Array<{imageUrl: string}>;
}

interface ITransactionProps {
  navigation: NavigationProp<any>;
}
function Transaction({navigation}: ITransactionProps): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('교환');
  const [tradeItems, setTradeItems] = useState<IProduct[]>([]);
  const [donationItems, setDonationItems] = useState<IProduct[]>([]);
  const [userId, setUserId] = useState<number>();
  // useEffect(() => {
  //   fetchUserContents();
  // }, []);

  useEffect(() => {
    const getUserinfo = async () => {
      const userinfos = await AsyncStorage.getItem('userinfo');
      const userinfo = JSON.parse(userinfos!);
      setUserId(Number(userinfo.userId)); // userId 세��
    };
    getUserinfo();
  }, []);

  useEffect(() => {
    if (userId !== undefined) {
      fetchUserContents();
    }
  }, [userId]);
  // const userId = Number(userinfo?.userId);
  console.log('userId:', userId);

  const fetchUserContents = async () => {
    try {
      // const userId = 1;
      const response = await axios.get(`${API_URL}/contents/listUser?userId=${userId}`);
      const contents = response.data.result;
      console.log('contents:', contents);
      const trades: IProduct[] = [];
      const donations: IProduct[] = [];

      contents.forEach((content: IContent) => {
        const item = {
          id: content.contentsId.toString(),
          name: content.title,
          status: content.status,
          description: content.description,
          images: content.images,
        };

        if (content.purpose === '교환') {
          trades.push(item);
        } else if (content.purpose === '나눔') {
          donations.push(item);
        }
      });

      setTradeItems(trades);
      setDonationItems(donations);
    } catch (error) {
      console.log('불러오기 실패:', error);
      throw error;
    }
  };

  // 리스트 아이템을 렌더링하는 함수
  const renderItem = ({item}: {item: IProduct}) => {
    let statusStyle;
    let statusText;

    switch (item.status) {
      case '대기중':
        statusStyle = styles.statusWaiting;
        statusText = '대기중';
        break;
      case '약속중':
        statusStyle = styles.statusInProgress;
        statusText = '약속중';
        break;
      case '완료':
        statusStyle = styles.statusCompleted;
        statusText = '완료';
        break;
      default:
        statusStyle = styles.statusDefault;
        statusText = item.status;
    }
    const imageUrl =
      item.images && item.images.length > 0
        ? item.images[0].imageUrl
        : 'https://via.placeholder.com/50';
    const handlePress = () => {
      navigation.navigate('ProductDetail', {productId: item.id});
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
        <Image style={styles.itemImage} source={{uri: imageUrl}} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View style={styles.itemStatusContainer}>
          <Text style={[styles.itemStatus, statusStyle]}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 탭 메뉴 */}
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

      {/* 리스트 */}
      <FlatList
        data={selectedTab === '교환' ? tradeItems : donationItems}
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusWaiting: {
    backgroundColor: '#FFA500',
    color: 'white',
  },
  statusInProgress: {
    backgroundColor: '#4169E1',
    color: 'white',
  },
  statusCompleted: {
    backgroundColor: '#228B22',
    color: 'white',
  },
  statusDefault: {
    backgroundColor: '#ccc',
    color: 'black',
  },
});

export default Transaction;
