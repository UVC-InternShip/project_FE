import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomButton from '../components/Button'; // CustomButton 컴포넌트 임포트
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // 네비게이션을 사용하기 위해 추가

function ProductDetail({ route }) {
  const { product } = route.params;
  const [activeTab, setActiveTab] = useState('상품 정보');  // 기본값을 '상품 정보'로 설정
  const [suggestions, setSuggestions] = useState([]); // 제안 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigation = useNavigation(); // 네비게이션 훅 사용

  // 상품 상세 정보를 API를 통해 다시 가져오는 함수
  const fetchProductDetails = async (contentsId: number) => {
    setLoading(true); // 로딩 시작
    try {
      const response = await fetch('http://10.0.2.2:3000/api/contents/listContents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentsId }), // 선택한 contentsId를 본문에 포함
      });
      const data = await response.json();
      if (response.ok) {
        // 상품 상세 페이지로 이동하면서 API에서 가져온 상품 데이터를 전달
        if (data.result[0].contentsId !== product.contentsId) {
          navigation.navigate('ProductDetail', { product: data.result[0] });
        }
      } else {
        console.error('상품 상세 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('API 요청 에러:', error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 페이지가 다시 포커스될 때마다 상품 데이터를 새로 가져오기
  useFocusEffect(
    useCallback(() => {
      fetchProductDetails(product.contentsId); // 페이지 포커스될 때 데이터를 다시 로드
      setActiveTab('상품 정보');  // 탭을 기본값 '상품 정보'로 설정
    }, [product.contentsId])
  );

  // 제안 목록 API 호출
  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://10.0.2.2:3000/api/offer/contentsList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposerContentId: product.contentsId, // POST 요청 본문에 contentsId를 포함
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.result); // API에서 받아온 데이터를 상태로 저장
      } else {
        throw new Error(data.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === '제안 목록') {
      fetchSuggestions();
    }
  }, [activeTab]);

  // 이미지 슬라이더를 FlatList로 구성
  const renderImageSlider = () => (
    <FlatList
      data={product.images || []}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()} // 이미지의 인덱스를 키로 사용
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.imageUrl }} // 실제 이미지 경로로 교체
          style={styles.productImage}
        />
      )}
    />
  );

  // 제안 목록을 가로 스크롤로 렌더링
  const renderSuggestions = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (suggestions.length === 0) {
      return <Text style={styles.noSuggestionsText}>제안 품목 없음</Text>;
    }

    return (
      <FlatList
        data={suggestions}
        horizontal  // 가로 스크롤 설정
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // item.id가 없을 경우 index를 키로 사용
        renderItem={({ item }) => (
          <View style={styles.suggestionItem}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.suggestionImage}
            />
            <CustomButton
              onPress={() => fetchProductDetails(item.contentsId)} // 클릭 시 API 요청을 통해 상품 상세 정보를 가져옴
              paddingHorizontal={20}
              paddingVertical={10}
              style={styles.suggestionButton}>
              <Text style={styles.suggestionButtonText}>선택</Text>
            </CustomButton>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* 상품 이미지 슬라이더 */}
      {renderImageSlider()}

      {/* 상품 정보 및 사용자 정보 */}
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: 'https://example.com/user-avatar.jpg' }} // 가상의 사용자 아바타 이미지
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>익명의 살롯</Text>
          <Text style={styles.userLocation}>서울시</Text>
        </View>
      </View>

      {/* 상품 정보와 제안 버튼 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === '상품 정보' && styles.activeTabButton]}
          onPress={() => setActiveTab('상품 정보')}
        >
          <Text style={[styles.tabText, activeTab === '상품 정보' && styles.activeTabText]}>
            상품 정보
          </Text>
        </TouchableOpacity>

        {/* 제안 목록 버튼에 갯수 추가 */}
        <TouchableOpacity
          style={[styles.tabButton, activeTab === '제안 목록' && styles.activeTabButton]}
          onPress={() => setActiveTab('제안 목록')}
        >
          <Text style={[styles.tabText, activeTab === '제안 목록' && styles.activeTabText]}>
            제안 목록 ({suggestions.length}) {/* 제안 목록 갯수 표시 */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 현재 활성화된 탭에 따라 콘텐츠 렌더링 */}
      {activeTab === '상품 정보' ? (
        <View style={styles.productDetailContainer}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productMeta}>가전제품 10분 전</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
      ) : (
        renderSuggestions() // 제안 목록을 렌더링 (가로 스크롤)
      )}

      {/* 하단 제안하기 버튼 */}
      <CustomButton
  onPress={() => navigation.navigate('ProductInput')} // 상품 입력 페이지로 이동
  paddingHorizontal={20}
  paddingVertical={15}
  style={styles.proposeButton}
>
  <Text style={styles.proposeButtonText}>제안하기</Text>
</CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userLocation: {
    fontSize: 14,
    color: '#888',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  productDetailContainer: {
    padding: 20,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productMeta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  suggestionItem: {
    marginHorizontal: 10, // 가로 간격을 위해 margin 추가
    alignItems: 'center',
    justifyContent: 'center',
    width: 150, // 각 항목의 가로 크기 지정
    paddingVertical: 15,
  },
  suggestionImage: {
    width: 120,  // 이미지 크기 설정
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  suggestionButton: {
    backgroundColor: '#a42ce4', // 버튼 배경색 변경
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  suggestionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  proposeButton: {
    backgroundColor: '#a42ce4',
    paddingVertical: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  proposeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  noSuggestionsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ProductDetail;
