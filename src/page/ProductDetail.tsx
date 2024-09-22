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
import {useProductInfo} from '../store/query/useGetProductInfo';
// import RemoteImage from '../components/RemoteImage';
import CustomFlatList from '../components/CustomFlatList';
import {useGetProposerList} from '../store/query/useGetProposalList';

// CHECKLIST : 상품 상세 페이지
// DESC 1. 내가 올린 상품의 상세 페이지에선 제안하기 버튼이 표시되지 않아야 한다.
// DESC 2. 다른 사람이 올린 상품의 상세 페이지에선 제안하기 버튼이 표시되어야 한다.
// [x] 현재 페이지의 작성자 아이디와 로그인 사용자의 아이디가 일치하는지 확인하여 제안하기 버튼을 조건부 렌더링한다.
// DESC 3. 내가 올린 상품이던 남이 올린 상품이던 제안 목록은 표시되어야 한다.
// DESC 4. 내가 올린 상품의 제안 목록에는 제안된 상품의 경우 사진과 선택하기 버튼이 표시되어야 한다.
// DESC 5. 다른 사람이 올린 상품의 제안 목록에는 사진과 정보만 표시되어야 한다.
// DESC 6. 제안 목록에서 선택하기를 누르면 해당 사용자와의 채팅 페이지로 이동한다.

interface ProductDetailPageProps {
  navigation: NavigationProp<any>;
}
function ProductDetailPage({navigation}: ProductDetailPageProps): JSX.Element {
  const route = useRoute();
  const {productId} = route.params as {productId: number};
  console.log('productId', typeof productId);
  const {isLoading: isLoadingProductInfo, data: productInfo} = useProductInfo(productId);

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
  const {isLoading: isLoadingProposalList, data: proposalList} = useGetProposerList(productId);
  // useEffect(() => {
  //   if (!isLoadingProposalList) {

  const [userinfo, setUserInfo] = useState<any>(null);
  const productRegisterUserId = productInfo[0]?.userId;
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

  const renderImages = ({item}: ListRenderItemInfo<IS3Image>) => {
    return <Image source={{uri: item.imageUrl}} style={styles.carouselImage} />;
  };
  useEffect(() => {
    if (!isLoadingProductInfo) {
      const urls = productInfo[0]?.images?.map((image: IS3Image) => ({
        imageUrl: image.imageUrl,
      }));
      setImgUrls(urls || []);
    }
  }, [isLoadingProductInfo, productInfo]);
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
  console.log(Dimensions.get('window').width, Dimensions.get('window').height);
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
        <TouchableOpacity onPress={() => setActiveTab('제안 목록')}>
          <Typo style={[styles.tab, activeTab === '제안 목록' && styles.activeTab]}>제안 목록</Typo>
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

      <View style={styles.buttonContainer}>
        {userId !== productRegisterUserId && (
          <CustomButton style={styles.button} onPress={pressSuggest}>
            <Typo fontSize={16} color="white">
              제안하기
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
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 16,
  },
});

export default ProductDetailPage;
