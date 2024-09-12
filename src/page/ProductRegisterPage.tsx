// import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  ImageURISource,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Typo from '../components/Typo';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import CustomButton from '../components/Button';
import LocalImage from '../components/LocalImage';
import {IFormData} from '../interface/interface';

const MAX_IMAGE_COUNT = 5;

function ProductRegisterPage(): JSX.Element {
  // const route = useRoute();
  // const {type} = route.params as {type: string};
  // type은 '물물교환' 또는 '나눔' 중 하나이다.
  // const [tradeType, setTradeType] = useState<string>('물물교환');
  // const [title, setTitle] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
  // const [image, setImage] = useState<ImageURISource[]>([]);
  const [formData, setFormData] = useState<IFormData>({
    title: '',
    description: '',
    contentsType: '상품',
    purpose: '물물교환',
    images: [],
  });
  console.log('formData', formData);
  const pressShotCamera = () => {
    if (formData.images.length >= MAX_IMAGE_COUNT) {
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
        Alert.alert('Error : ' + response.errorMessage);
      } else {
        if (response.assets !== null) {
          const uri = response.assets[0].uri;
          setFormData({...formData, images: [...formData.images, {uri}]});
        }
      }
    });
  };
  // console.log('image', image);

  const pressSelectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: MAX_IMAGE_COUNT - formData.images.length,
    };

    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      Alert.alert('취소되었습니다.');
    } else if (response.errorMessage) {
      Alert.alert('Error :' + response.errorMessage);
    } else {
      // const uris: Asset[] = [];
      // response.assets?.forEach(value => uris.push(value.uri));
      // setImage(uris);
      const newImages = response.assets?.map(asset => ({uri: asset.uri}));
      setFormData({...formData, images: [...formData.images, ...newImages]});
    }
  };

  const handleDeleteImage = (index: number) => {
    // setImage(image.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const pressRegisterProduct = () => {
    console.log('상품 등록');
  };

  const toggleTradeType = (type: string) => {
    // setTradeType(type);
    setFormData({...formData, purpose: type});
  };
  // 물물교환과 나눔 버튼은 둘 중 하나만 선택되어야 한다.
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
          {formData.images.map((img, index) => (
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
      <View style={styles.postTitleCon}>
        <Typo fontSize={24} style={{fontWeight: 700}}>
          상품 이름
        </Typo>
        <TextInput
          style={styles.input}
          onChangeText={text => setFormData({...formData, title: text})}
          value={formData.title}
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
            onPress={() => toggleTradeType('물물교환')}
            selected={formData.purpose === '물물교환'}>
            <Typo color={formData.purpose === '물물교환' ? 'white' : 'black'}>
              물물교환
            </Typo>
          </CustomButton>
          <CustomButton
            style={styles.tradeButton}
            onPress={() => toggleTradeType('나눔')}
            selected={formData.purpose === '나눔'}>
            <Typo color={formData.purpose === '나눔' ? 'white' : 'black'}>
              나눔
            </Typo>
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
          onChangeText={text => setFormData({...formData, description: text})}
          value={formData.description}
        />
      </View>
      <CustomButton
        onPress={pressRegisterProduct}
        style={styles.registerButton}>
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
});

export default ProductRegisterPage;
