import {NavigationProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {dummyData} from '../assets/dummy';
import {IS3Image} from '../interface/interface';
import Typo from '../components/Typo';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import {useProductInfo} from '../store/query/useGetProductInfo';
// import RemoteImage from '../components/RemoteImage';
import CustomFlatList from '../components/CustomFlatList';
import {useGetProposerList} from '../store/query/useGetProposalList';
import axios from 'axios';
import {API_URL} from '../../config';

// CHECKLIST : 상품 상세 페이지
// DESC 1. 내가 올린 상품의 상세 페이지에선 제안하기 버튼이 표시되지 않아야 한다.
// DESC 2. 다른 사람이 올린 상품의 상세 페이지에선 제안하기 버튼이 표시되어야 한다.
// [x] 현재 페이지의 작성자 아이디와 로그인 사용자의 아이디가 일치하는지 확인하여 제안하기 버튼을 조건부 렌더링한다.
// DESC 3. 내가 올린 상품이던 남이 올린 상품이던 제안 목록은 표시되어야 한다.
// DESC 4. 내가 올린 상품의 제안 목록에는 제안된 상품의 경우 사진과 선택하기 버튼이 표시되어야 한다.
// DESC 5. 다른 사람이 올린 상품의 제안 목록에는 사진과 정보만 표시되어야 한다.
// DESC 6. 제안 목록에서 선택하기를 누르면 해당 사용자와의 채팅 페이지로 이동한다.
// DESC 7. 나눔 상품의 경우 제안 목록은 표시되지 않는다.
// DESC 8. 나눔 상품의 경우 하단부에 채팅하기 버튼이 표시되어야 한다.

interface ProductDetailPageProps {
  navigation: NavigationProp<any>;
}
function ProductDetailPage({navigation}: ProductDetailPageProps): JSX.Element {
  const route = useRoute();
  const {productId} = route.params as {productId: number};
  const {isLoading: isLoadingProductInfo, data: productInfo} = useProductInfo(productId);
  const [productOwnerId, setProductOwnerId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('상품 정보');
  const {isLoading: isLoadingProposalList, data: proposerList} = useGetProposerList(productId);
  const [userinfo, setUserInfo] = useState<any>(null);
  const [purpose, setPurpose] = useState<string>('교환');
  // const productRegisterUserId = productInfo[0]?.userId;
  console.log(productInfo);
  console.log('상품 주인', productOwnerId);
  console.log('제안목록', proposerList);
  const [imgUrls, setImgUrls] = useState<{imageUrl: string}[]>([]);

  console.log('제안목록', proposerList);
  // CHECK: 제안목록을 불러왔을 때, 제안목록을 보여줄 정보가 담겨 있지 않음.
  useEffect(() => {
    const getUserinfo = async () => {
      const userinfos = await AsyncStorage.getItem('userinfo');
      setUserInfo(JSON.parse(userinfos!));
    };
    getUserinfo();
  }, []);
  const userId = userinfo?.userId;
  console.log('현재 사용자', userId);

  const renderImages = ({item}: ListRenderItemInfo<IS3Image>) => {
    return <Image source={{uri: item.imageUrl}} style={styles.carouselImage} />;
  };
  useEffect(() => {
    if (!isLoadingProductInfo && productInfo && productInfo.length > 0) {
      setProductOwnerId(productInfo[0].userId);
      setPurpose(productInfo[0].purpose);
      const urls = productInfo[0]?.images?.map((image: IS3Image) => ({
        imageUrl: image.imageUrl,
      }));
      setImgUrls(urls || []);
    }
  }, [isLoadingProductInfo, productInfo]);
  console.log('상품의 목적', purpose);
  // const imageUrls = productInfo[0]?.images?.map((image: IS3Image) => ({imageUrl: image.imageUrl}));
  // console.log('imageUrls', imageUrls);
  // CHECK 제안리스트의 상품 클릭 시 해당 상품 상세 페이지로 이동.
  // const handleProductPress = (id: number) => {
  //   navigation.navigate('ProductDetail', {productId: id});
  // };

  // DESC 나눔 채팅 페이지로 이동한다.
  // DESC 이때, 함께 넘겨줘야할 정보는 아래와 같다.
  // DESC 1. userId => 채팅을 시작하려는 사용자 (즉, 물건을 올린 사람)
  // DESC 2. writerId => 상대방 (즉, 제안을 한 사람)
  // DESC 3. productId => 채팅을 시작하려는 상품의 아이디
  const pressShareChat = async () => {
    try {
      const response = await axios.post(`${API_URL}/chat/create`, {
        userId: userId,
        writerId: productOwnerId,
        itemId: productId,
      });
      if (response.data.message === 'success') {
        navigation.navigate('ChatRoom', {
          userId: userId,
          writerId: productOwnerId,
          itemId: productId,
          chatRoomId: response.data.chatRoomId,
        });
      } else if (response.data.message === 'already exist') {
        navigation.navigate('ChatRoom', {
          userId: userId,
          writerId: productOwnerId,
          itemId: productId,
          chatRoomId: response.data.checkroom._id,
        });
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const pressTradeChat = () => {
    console.log('교환 채팅하기');
  };

  const pressSuggestProduct = () => {
    navigation.navigate('ProductRegister', {
      type: '교환',
      offer: true,
      productId: productId,
      proposalId: productInfo[0]?.userId,
    });
  };

  // const pressShareChat = () => {
  //   navigation.navigate('ChatRoom', {
  //     userId: productOwnerId,
  //     writerId: userId,
  //     productId: productId,
  //   });
  // };
  return (
    <View style={styles.container}>
      {/* 캐러셀 슬라이드 */}
      <View style={styles.carouselContainer}>
        {!isLoadingProductInfo && (
          <CustomFlatList
            data={imgUrls}
            renderItem={renderImages}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
      {/* 사용자 정보 구역 */}
      <View style={styles.userInfoContainer}>
        <Typo>사용자 정보 구역</Typo>
      </View>

      {/* 탭 */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setActiveTab('상품 정보')}>
          <Typo style={[styles.tab, activeTab === '상품 정보' && styles.activeTab]}>상품 정보</Typo>
        </TouchableOpacity>
        {purpose !== '나눔' && (
          <TouchableOpacity onPress={() => setActiveTab('제안 목록')}>
            <Typo style={[styles.tab, activeTab === '제안 목록' && styles.activeTab]}>
              제안 목록
            </Typo>
          </TouchableOpacity>
        )}
      </View>

      {/* 탭 내용 */}
      {activeTab === '상품 정보' && !isLoadingProductInfo && (
        <View style={styles.tabContent}>
          <Typo>{productInfo[0]?.description}</Typo>
        </View>
      )}
      {/* 아직 제안된 내용이 없다면 이에 대한 처리를 해주어야함 */}
      {activeTab === '제안 목록' && !isLoadingProposalList && (
        <View style={styles.tabContent}>
          {proposerList.length > 0 ? (
            <>
              <FlatList
                data={proposerList}
                horizontal
                keyExtractor={item => item.contentsId.toString()}
                renderItem={({item}) => (
                  <View>
                    <ProductCard
                      imageUrl={item.images[0].imageUrl}
                      title={item.title}
                      description={item.description}
                      contentType={item.content_type}
                      purpose={item.purpose}
                      status={item.status}
                      onPress={() => pressSuggestProduct(item.contentsId)}
                    />
                    <Button title="채팅하기" onPress={pressTradeChat} />
                  </View>
                )}
                contentContainerStyle={styles.listContainer}
              />
            </>
          ) : (
            <Typo>제안 목록이 없습니다.</Typo>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        {userId !== productOwnerId && (
          <CustomButton
            style={styles.button}
            onPress={purpose === '나눔' ? pressShareChat : pressSuggestProduct}>
            <Typo fontSize={16} color="white">
              {purpose === '나눔' ? '채팅하기' : '제안하기'}
            </Typo>
          </CustomButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  carouselContainer: {
    flex: 5, // 50% of the remaining height
  },
  carouselImage: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  userInfoContainer: {
    flex: 0.5, // 10% of the remaining height
    padding: 16,
  },
  tabsContainer: {
    flex: 1, // 30% of the remaining height
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  tab: {
    padding: 16,
  },
  activeTab: {
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabContent: {
    flex: 3,
  },
  buttonContainer: {
    flex: 1, // 10% of the remaining height
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: Dimensions.get('window').width * 0.8,
    height: 32,
    borderRadius: 10,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6235e7',
  },
  listContainer: {
    // width: Dimensions.get('window').width * 0.5,
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 16,
  },
});

export default ProductDetailPage;
