// import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Typo from '../../components/common/Typo';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import CustomButton from '../../components/common/Button';
import LocalImage from '../../components/common/LocalImage';
import {TImage} from '../../interface/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useRoute} from '@react-navigation/native';
import {useOfferProduct, useRegisterProduct} from '../../store/mutation/useRegisterProduct';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {API_URL} from '../../../config';

const MAX_IMAGE_COUNT = 5;

interface ProductRegisterPageProps {
  navigation: NavigationProp<any>;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

function ProductRegisterPage({navigation}: ProductRegisterPageProps): JSX.Element {
  const route = useRoute();
  const {type} = route.params as {type: string};
  const {offer} = route.params as {offer: string};
  const {productId} = route.params as {productId: number};
  const {proposalId} = route.params as {proposalId: number};
  // type은 '교환' 또는 '나눔' 중 하나이다.
  const [tradeType, setTradeType] = useState<string>('교환');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [userinfo, setUserInfo] = useState<any>(null);
  const [image, setImage] = useState<TImage[]>([]);
  const [address, setAddress] = useState<string>(''); // 주소 상태 추가

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '앱이 위치에 접근하려고 합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('위치 권한 허용됨');
        } else {
          console.log('위치 권한 거부됨');
        }
      }
    };

    requestLocationPermission();
  }, []);

  const pressGetGeo = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('현재 위치:', position);

        try {
          const response = await axios.post(`${API_URL}/location/get-address`, {
            latitude: latitude,
            longitude: longitude,
          });
          console.log('주소 정보:', response.data);
          setAddress(response.data.fullAddress); // 주소 상태 업데이트
        } catch (error) {
          console.error('주소 정보를 가져오는 중 오류 발생:', error);
        }
      },
      error => {
        console.log('위치 오류:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    const getUserinfo = async () => {
      const userinfos = await AsyncStorage.getItem('userinfo');
      setUserInfo(JSON.parse(userinfos!));
    };
    getUserinfo();
  }, []);

  useEffect(() => {
    if (type === '나눔') {
      setTradeType('나눔');
    } else {
      setTradeType('교환');
    }
  }, [type]);

  const pressShotCamera = () => {
    if (image.length >= MAX_IMAGE_COUNT) {
      Alert.alert('사진은 5개까지만 등록할 수 있습니다.');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
      quality: 1,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert('촬영이 취소되었습니다.');
      } else if (response.errorMessage) {
        Alert.alert(response.errorMessage);
      } else {
        if (response.assets) {
          const img = response.assets as TImage[];
          setImage(prevImages => [...prevImages, ...img]);
        }
      }
    });
  };

  const pressSelectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: MAX_IMAGE_COUNT - image.length,
    };

    const response = await launchImageLibrary(options);
    if (response.didCancel) {
      Alert.alert('취소되었습니다.');
    } else if (response.errorMessage) {
      Alert.alert('Error :' + response.errorMessage);
    } else {
      const img = response.assets as TImage[];
      setImage(img);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImage(image.filter((_, i) => i !== index)); // image 상태 업데이트
  };

  const {mutate: registerProduct} = useRegisterProduct(navigation);
  const {mutate: offerProduct} = useOfferProduct(navigation);

  const pressRegisterProduct = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('contentsType', '상품');
    formData.append('purpose', tradeType);
    formData.append('userId', userinfo?.userId.toString());
    formData.append('categoryId', '1');
    formData.append('status', '대기중'); // categoryId: 1 (default)

    image.forEach((img, index) => {
      formData.append('images', {
        uri: img.uri,
        name: `img${index}.jpg`,
        type: img.type,
      });
    });
    console.log('폼데이터:', formData);
    try {
      if (offer) {
        formData.append('proposalUserId', proposalId);
        formData.append('offererUserId', userinfo?.userId.toString());
        formData.append('proposerContentId', productId); // offererUserId or proposalUserId
        offerProduct(formData);
      } else {
        registerProduct(formData);
      }
    } catch (error) {
      console.error('Error registering product:', error);
      Alert.alert('상품등록실패');
    }
  };

  const toggleTradeType = (n: number) => {
    // setTradeType(type);
    if (n === 1) {
      setTradeType('교환');
    } else if (n === 2) {
      setTradeType('나눔');
    }
  };
  // 교환과 나눔 버튼은 둘 중 하나만 선택되어야 한다.
  // 즉, 각 버튼의 스타일은 조건부 렌더링으로 되어야 한다.

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.postImageCon}>
        <Typo color="black" fontSize={24} style={{fontWeight: 700}}>
          이미지
        </Typo>
        <View style={styles.selectCon}>
          <Icon.Button
            name="camera"
            onPress={pressShotCamera}
            backgroundColor={'#fff'}
            color={'#000'}
            style={styles.button}
            size={50}
            iconStyle={{marginRight: 0}}
          />
          <Icon.Button
            name="image"
            onPress={pressSelectImage}
            backgroundColor={'#fff'}
            color={'#000'}
            style={styles.button}
            size={50}
            iconStyle={{marginRight: 0}}
          />
        </View>
        <ScrollView horizontal style={styles.ImageCon}>
          {image.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <LocalImage localAsset={img} width={100} height={100} />
              <Icon.Button
                name="trash"
                onPress={() => handleDeleteImage(index)}
                backgroundColor={'#fff'}
                color="blue"
                size={24}
                iconStyle={{margin: 0}}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.locationContainer}>
        <Icon.Button name="navigate-circle-outline" size={24} color="blue" onPress={pressGetGeo} />
        <Typo style={styles.addressText}>{address}</Typo>
      </View>

      <View style={styles.postTitleCon}>
        <Typo fontSize={24} style={{fontWeight: 700}}>
          상품 이름
        </Typo>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
          placeholder="상품 이름을 등록해주세요."
        />
      </View>
      <View style={styles.typeCon}>
        <Typo fontSize={24} style={{fontWeight: 700}}>
          거래 방식
        </Typo>
        <View style={styles.btnGroup}>
          <CustomButton
            style={styles.tradeButton}
            onPress={() => toggleTradeType(1)}
            selected={tradeType === '교환'}>
            <Typo color={tradeType === '교환' ? 'white' : 'black'}>물물교환</Typo>
          </CustomButton>
          <CustomButton
            style={styles.tradeButton}
            onPress={() => toggleTradeType(2)}
            selected={tradeType === '나눔'}>
            <Typo color={tradeType === '나눔' ? 'white' : 'black'}>나눔</Typo>
          </CustomButton>
        </View>
      </View>
      <View style={styles.postDescCon}>
        <Typo fontSize={24} style={{fontWeight: 700}}>
          설명
        </Typo>
        <TextInput
          multiline
          placeholder="상품에 대한 상세한 설명을 입력해주세요."
          style={styles.descInput}
          onChangeText={setDescription}
          value={description}
        />
      </View>
      <CustomButton onPress={pressRegisterProduct} style={styles.registerButton}>
        <Typo fontSize={24} style={{fontWeight: 700}}>
          등록하기
        </Typo>
      </CustomButton>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'flex-start',
  },
  postImageCon: {
    height: '40%',
    flexDirection: 'column',
    marginHorizontal: 16,
    gap: 16,
  },
  selectCon: {
    flexDirection: 'row',
    gap: 8,
  },
  ImageCon: {
    // position: 'relative',
    flexDirection: 'row',
    gap: 8,
    maxHeight: 150,
  },
  button: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  tradeButton: {
    width: 100,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  postTitleCon: {
    height: '10%',
    flexDirection: 'column',
    marginHorizontal: 16,
    gap: 16,
  },
  input: {
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    height: 50,
  },
  descInput: {
    height: '65%',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  typeCon: {
    flexDirection: 'column',
    marginTop: 32,
    marginHorizontal: 16,
    gap: 16,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  postDescCon: {
    height: '25%',
    flexDirection: 'column',
    marginTop: 16,
    marginHorizontal: 16,
    gap: 16,
  },
  imageWrapper: {
    position: 'relative',
    gap: 8,
    marginRight: 8,
  },
  clickedBtn: {
    backgroundColor: 'black',
    width: 100,
    height: 26,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    color: 'white',
  },
  unClickedBtn: {
    backgroundColor: 'white',
    width: 100,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  registerButton: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    // paddingVertical: 8,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});

export default ProductRegisterPage;
