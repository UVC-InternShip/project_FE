import React, {useRef, useState, useEffect} from 'react';
import {Animated, StyleSheet, Text, View, ActivityIndicator, FlatList, Dimensions} from 'react-native';
import CustomButton from '../components/Button';
import Typo from '../components/Typo';
import {NavigationProp} from '@react-navigation/native';

const {width} = Dimensions.get('window'); // 화면의 가로 크기를 가져옴

interface HomeProps {
  navigation: NavigationProp<any>;
}

function Home({navigation}: HomeProps): JSX.Element {
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/api/contents/listAll');
        const data = await response.json();
        console.log('API 응답 데이터:', data.result); // 응답 데이터를 로그로 출력
        setProducts(data.result);  // 여기서 products 상태를 업데이트
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const pressBarterBtn = () => {
    navigation.navigate('ProductRegister', {type: 'barter'});
  };

  const pressShareBtn = () => {
    navigation.navigate('ProductRegister', {type: 'share'});
  };

  const pressBtn = () => {
    setShowButton(!showButton);
    if (showButton) {
      fadeOut();
    } else {
      fadeIn();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <View style={styles.productLeft}>
        <View style={styles.imagePlaceholder} />
      </View>
      <View style={styles.productCenter}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <CustomButton
          style={styles.productButton}
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
          <Typo color="white">물물교환</Typo>
        </CustomButton>
      </View>
      <View style={styles.productRight}>
        <View style={styles.circleIcon} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>This is Home Screen</Text>
      <CustomButton style={styles.buttonContainer} onPress={pressBtn}>
        <Typo color="black">물건 등록</Typo>
      </CustomButton>

      {showButton && (
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
      )}

      {/* FlatList를 사용하여 스크롤 가능한 제품 리스트를 렌더링 */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // 고유 키 설정
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false} // 세로 스크롤바 숨김
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  additionalButtonsContainer: {
    position: 'absolute',
    bottom: 120,
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
    marginBottom: 10,
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  productItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    width: width * 0.9, // 화면의 90% 너비로 설정
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  productLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  productCenter: {
    flex: 3,
    justifyContent: 'center',
  },
  productRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productButton: {
    backgroundColor: '#d3d3f3',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#d3d3f3',
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
});

export default Home;
