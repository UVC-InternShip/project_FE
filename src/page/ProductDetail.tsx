import {NavigationProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {dummyData} from '../assets/dummy';
import {IS3Image} from '../interface/interface';
import Typo from '../components/Typo';
import {
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
import { useProductInfo } from '../store/query/useGetProductInfo';
// import RemoteImage from '../components/RemoteImage';
import CustomFlatList from '../components/CustomFlatList';

interface ProductDetailPageProps {
  navigation: NavigationProp<any>;
}
function ProductDetailPage({navigation}: ProductDetailPageProps): JSX.Element {
  const route = useRoute();
  const {productId} = route.params as {productId: number};
  console.log('productId', typeof productId);
  const {isLoading, data: productInfo} = useProductInfo(productId);
  console.log('로딩상태',isLoading)
  console.log('productInfo', productInfo);
  console.log('productId', productId);
  // const [productInfo, setProductInfo] = useState<IProduct | undefined>(
  //   undefined,
  // );
  // console.log(productInfo.images[0])
  console.log('productInfo 타입', typeof productInfo);

  const [activeTab, setActiveTab] = useState<string>('상품 정보');
  // TODO
  // [ ] 제안목록 useQuery로 받아오기
  // const [suggestion, setSuggestion] = useState<IProduct[]>([]);
  const [userinfo, setUserInfo] = useState<any>(null);
  const productRegisterUserId = productInfo?.userId;
  const [imgUrls, setImgUrls] = useState<{imageUrl: string}[]>([]);
  // NOTE: 상품 조회 API 존재하지 않음. 백엔드 문의.
  // TODO
  // [ ] 상품 상세페이지 내부 캐러셀 이미지 표시 안됨

  useEffect(() => {
    const getUserinfo = async () => {
      const userinfos = await AsyncStorage.getItem('userinfo');
      setUserInfo(JSON.parse(userinfos!));
    };
    getUserinfo();
  }, []);
  console.log('userInfo', userinfo);
  const userId = userinfo?.userId;
  console.log('유저아이디', userId);

  const renderImages = ({ item }: ListRenderItemInfo<IS3Image>) => {
    return (
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.carouselImage}
      />
    );
  };
  useEffect(() => {
    if (!isLoading) {
      const urls = productInfo[0]?.images?.map((image: IS3Image) => ({
        imageUrl: image.imageUrl,
      }));
      setImgUrls(urls || [])
    }
  },[isLoading, productInfo]);
  // const imageUrls = productInfo[0]?.images?.map((image: IS3Image) => ({imageUrl: image.imageUrl}));
  // console.log('imageUrls', imageUrls);
  // CHECK 제안리스트의 상품 클릭 시 해당 상품 상세 페이지로 이동.
  // const handleProductPress = (id: number) => {
  //   navigation.navigate('ProductDetail', {productId: id});
  // };

  const pressSuggest = () => {
    navigation.navigate('ProductRegister', {
      type: '교환',
      offer: true,
      productId: productId,
      proposalId: productInfo[0]?.userId,
    });
  };
  return (
    <View style={styles.container}>
      {/* 캐러셀 슬라이드 */}
      {!isLoading && (
      <CustomFlatList
      data={imgUrls}
      renderItem={renderImages}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
      )}

      <View style={styles.userInfoContainer}>
        <Typo>사용자 정보 구역</Typo>
      </View>
      

      {/* 탭 */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setActiveTab('상품 정보')}>
          <Typo
            style={[styles.tab, activeTab === '상품 정보' && styles.activeTab]}>
            상품 정보
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('제안 목록')}>
          <Typo
            style={[styles.tab, activeTab === '제안 목록' && styles.activeTab]}>
            제안 목록
          </Typo>
        </TouchableOpacity>
      </View>

      {/* 탭 내용 */}
      {activeTab === '상품 정보' && (
        <View style={styles.tabContent}>
          <Typo>{productInfo?.description}</Typo>
        </View>
      )}
      {activeTab === '제안 목록' && (
        <View style={styles.tabContent}>
          <FlatList
            data={dummyData}
            horizontal
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <ProductCard
                // imageUrl={item.images[0].imageUrl}
                imageUrl={item.images[0].imageUrl}
                title={item.title}
                description={item.description}
                content_type={item.content_type}
                purpose={item.purpose}
                status={item.status}
                // created_at={item.created_at}
                // onPress={() => handleProductPress(item.id)}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        {/* <CustomButton style={styles.button} onPress={pressLike}>
          <Typo>좋아요</Typo>
        </CustomButton> */}
        {userId !== productRegisterUserId && (
          <CustomButton style={styles.button} onPress={pressSuggest}>
            <Typo>제안하기</Typo>
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
  carouselImage: {
    width: Dimensions.get('window').width, // 이미지 너비를 화면 너비로 설정
    height: Dimensions.get('window').height * 0.4, // 이미지 높이 설정 (필요에 따라 조절)
  },
  userInfoContainer: {
    padding: 16,
    height: Dimensions.get('window').height * 0.1,
  },
  tabsContainer: {
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
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    // 버튼 스타일 설정
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 16,
  },
});

export default ProductDetailPage;
