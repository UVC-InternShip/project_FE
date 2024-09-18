import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, FlatList, StyleSheet, Text, View} from 'react-native';
import CustomButton from '../components/Button';
import Typo from '../components/Typo';
import {useProductList} from '../store/query/useGetProductList';
import {NavigationProp} from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import {dummyData} from '../assets/dummy';
import axios from 'axios';
import {API_URL} from '../../config';

interface HomeProps {
  navigation: NavigationProp<any>;
}

function Home({navigation}: HomeProps): JSX.Element {
  const [showButton, setShowButton] = useState(false);
  const {isLoading, data: products} = useProductList();
  const [productList, setProductList] = useState<any[]>([]);
  console.log('products', products);

  // const pressBarterBtn = () => {
  //   navigation.navigate('ProductRegister', {type: 'barter'});
  // };

  // const pressShareBtn = () => {
  //   navigation.navigate('ProductRegister', {type: 'share'});
  // };

  const pressRegisterBtn = () => {
    navigation.navigate('ProductRegister', {type: 'trade'});
  };

  const handleProductPress = (id: number) => {
    navigation.navigate('ProductDetail', {productId: id});
  };
  return (
    <View style={styles.container}>
      <CustomButton style={styles.buttonContainer} onPress={pressRegisterBtn}>
        <Typo color="black">물건 등록</Typo>
      </CustomButton>
      <FlatList
        data={products}
        keyExtractor={item => item.userId.toString()}
        renderItem={({item}) => (
          <ProductCard
            // imageUrl={item.images[0].imageUrl}
            imageUrl={item.images[0]}
            title={item.title}
            description={item.description}
            content_type={item.content_type}
            purpose={item.purpose}
            status={item.status}
            created_at={item.created_at}
            onPress={() => handleProductPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
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
