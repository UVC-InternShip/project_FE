import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {dummyData} from '../assets/dummy';
import {IProduct} from '../interface/interface';
import Typo from '../components/Typo';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '../components/Button';

function ProductDetailPage(): JSX.Element {
  const route = useRoute();
  const {productId} = route.params as {productId: number};
  const [productInfo, setProductInfo] = useState<IProduct | undefined>(
    undefined,
  );

  const [activeTab, setActiveTab] = useState('상품 정보');
  const [suggestion, setSuggestion] = useState<IProduct[]>([]);

  // 상품 상제 정보 API 호출
  // 우선은 dummy data로 대체
  useEffect(() => {
    const getProductInfo = async () => {
      const response = dummyData.filter(item => item.id === productId);
      setProductInfo(response[0]);
    };
    getProductInfo();
  }, [productId]);
  console.log('productInfo', productInfo);

  const renderImages = ({item}) => (
    <Image source={item} style={styles.carouselImage} />
  );
  // useEffect(() => {
  //   const getProductInfo = async () => {
  //       // API 요청
  //       // const response = await axios.get('상��� 상세 API URL', {
  //       //   headers: {
  //       //     Authorization: 'Bearer token',
  //       //   },
  //       // });
  //       // console.log('productInfo', response.data);
  //       // 하지만, 현재 api 가 없기 때문에, 우선은 dummy data로 대체
  //       const response = dummyData.filter((item) => item.id === productId);
  //       setProductInfo(response);
  //   }
  //   getProductInfo();
  // })
  const pressLike = () => {
    console.log('like');
  };

  // const renderSuggestionList = ({product}) => {

  // }

  const pressSuggest = () => {
    console.log('제안');
  };
  return (
    <View style={styles.container}>
      {/* 캐러셀 슬라이드 */}
      <FlatList
        data={productInfo?.images} // 상품 이미지 데이터 사용
        renderItem={renderImages}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      {/* 사용자 정보 구역 */}
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
          <Typo>제안 목록 내용</Typo>
        </View>
      )}

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        <CustomButton style={styles.button} onPress={pressLike}>
          <Typo>좋아요</Typo>
        </CustomButton>
        <CustomButton style={styles.button} onPress={pressSuggest}>
          <Typo>제안하기</Typo>
        </CustomButton>
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
    height: 200, // 이미지 높이 설정 (필요에 따라 조절)
  },
  userInfoContainer: {
    padding: 16,
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
});

export default ProductDetailPage;
