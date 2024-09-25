import React, {useEffect, useMemo} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import CustomButton from '../components/Button';
import Typo from '../components/Typo';
import {useProductList} from '../store/query/useGetProductList';
import {NavigationProp} from '@react-navigation/native';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  navigation: NavigationProp<any>;
}

function Home({navigation}: HomeProps): JSX.Element {
  // const [showButton, setShowButton] = useState(false);
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useProductList();
  // TODO
  // [ ] isLoading 시 보여줄 프로그레스 구현.
  // [ ] 물물교환과 나눔 상품 필터링 구현.
  const products = useMemo(() => data?.pages.flat() || [], [data]);
  console.log(products);
  useEffect(() => {
    // products가 변경되었다면 게시글 조회를 다시 시도.
    console.log('새로고침');
  }, [products]);

  console.log('hasNextPage', hasNextPage);
  console.log('isFetchingNextPage', isFetchingNextPage);
  const pressRegisterBtn = () => {
    navigation.navigate('ProductRegister', {type: 'trade'});
  };

  const handleProductPress = (id: number) => {
    navigation.navigate('ProductDetail', {productId: id});
  };

  const loadMoreProducts = () => {
    if (hasNextPage) {
      console.log('다음 페이지를 불러오는 중...........!!!!!!!!');
      fetchNextPage();
    }
  };
  return (
    <View style={styles.container}>
      <CustomButton style={styles.buttonContainer} onPress={pressRegisterBtn}>
        <Typo color="black">물건 등록</Typo>
      </CustomButton>
      <FlatList
        data={products}
        keyExtractor={item => item.contentsId.toString()}
        renderItem={({item}) => (
          <ProductCard
            imageUrl={item.images[0].imageUrl}
            title={item.title}
            description={item.description}
            contentType={item.contentType}
            purpose={item.purpose}
            status={item.status}
            created_at={item.created_at}
            onPress={() => handleProductPress(item.contentsId)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    right: 50,
    width: 120,
    height: 40,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f2f222',
    zIndex: 10,
  },
  additionalButtonsContainer: {
    position: 'absolute',
    bottom: 120, // 물건 등록 버튼 아래에 위치
    right: 50,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  additionalButton: {
    width: 120,
    height: 40,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f2f222',
    marginBottom: 10, // 버튼 간 간격 조절
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 16,
  },
});

export default Home;
