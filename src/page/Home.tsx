import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, FlatList, StyleSheet, Text, View} from 'react-native';
import CustomButton from '../components/Button';
import Typo from '../components/Typo';
import {useProductList} from '../store/query/useGetProductList';
import {NavigationProp} from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import {dummyData} from '../assets/dummy';

interface HomeProps {
  navigation: NavigationProp<any>;
}

function Home({navigation}: HomeProps): JSX.Element {
  const [showButton, setShowButton] = useState(false);
  const {isLoading, data: products} = useProductList();
  // const navigation = useNavigation();

  // const fadeAnim = useRef(new Animated.Value(0)).current;

  // const fadeIn = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // };
  // const fadeOut = () => {
  //   // Will change fadeAnim value to 0 in 3 seconds
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 3000,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // useEffect(() => {
  //   if (showButton) {
  //     fadeIn();
  //   } else {
  //     fadeOut();
  //   }
  // }, [showButton]);
  // const fadeIn = useCallback(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [fadeAnim]);

  // const fadeOut = useCallback(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [fadeAnim]);

  // useEffect(() => {
  //   if (showButton) {
  //     fadeIn();
  //   } else {
  //     fadeOut();
  //   }
  // }, [showButton, fadeIn, fadeOut]);

  // const pressBarterBtn = () => {
  //   navigation.navigate('ProductRegister', {type: 'barter'});
  // };

  // const pressShareBtn = () => {
  //   navigation.navigate('ProductRegister', {type: 'share'});
  // };

  const pressRegisterBtn = () => {
    navigation.navigate('ProductRegister', {type: 'trade'});
  };

  // const pressBtn = () => {
  //   setShowButton(!showButton);
  //   if (showButton) {
  //     fadeOut();
  //   } else {
  //     fadeIn();
  //   }
  // };

  const handleProductPress = (id: number) => {
    navigation.navigate('ProductDetail', {productId: id});
  };
  return (
    <View style={styles.container}>
      <CustomButton style={styles.buttonContainer} onPress={pressRegisterBtn}>
        <Typo color="black">물건 등록</Typo>
      </CustomButton>

      {/* {showButton && (
        <Animated.View
          style={[styles.additionalButtonsContainer, {opacity: fadeAnim}]}>
          <CustomButton
            style={styles.additionalButton}
            onPress={pressBarterBtn}>
            <Typo color="black">물물교환</Typo>
          </CustomButton>
          <CustomButton style={styles.additionalButton} onPress={pressShareBtn}>
            <Typo color="black">나눔</Typo>
          </CustomButton>
        </Animated.View>
      )} */}
      <FlatList
        data={dummyData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ProductCard
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
