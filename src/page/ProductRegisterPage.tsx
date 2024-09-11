import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  ImageURISource,
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
  Asset,
} from 'react-native-image-picker';
import CustomButton from '../components/Button';
import LocalImage from '../components/LocalImage';
import {IFormData} from '../interface/interface';

const MAX_IMAGE_COUNT = 5;

function ProductRegisterPage(): JSX.Element {
  const route = useRoute();
  const {type} = route.params as {type: string};

  const [tradeType, setTradeType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<ImageURISource[]>([]);
  const [formData, setFormData] = useState<IFormData>({
    title: '',
    description: '',
    contentsType: '상품',
    purpose: type,
    images: [],
  });
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
        Alert.alert('Error : ' + response.errorMessage);
      } else {
        if (response.assets !== null) {
          const uri = response.assets[0].uri;
          // const source = {uri: uri};
          setImage([...image, {uri}]);
        }
      }
    });
  };
  console.log('image', image);

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
      // const uris: Asset[] = [];
      // response.assets?.forEach(value => uris.push(value.uri));
      // setImage(uris);
      const newImages = response.assets?.map(asset => ({uri: asset.uri}));
      setImage([...image, ...newImages]); // 새로운 이미지들을 배열에 추가
    }
  };

  const handleDeleteImage = (index: number) => {
    setImage(image.filter((_, i) => i !== index));
  };

  const pressRegisterProduct = () => {
    console.log('상품 등록');
  };

  return (
    <View style={styles.container}>
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
          {type}
        </Typo>
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
      <CustomButton
        onPress={pressRegisterProduct}
        style={styles.registerButton}>
        <Typo fontSize={24} style={{fontWeight: 700}}>
          등록하기
        </Typo>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // alignItems: 'flex-start',
  },
  postImageCon: {
    height: '35%',
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
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
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
    height: '50%',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  typeCon: {
    flexDirection: 'column',
    margin: 16,
    gap: 16,
  },
  postDescCon: {
    height: '35%',
    flexDirection: 'column',
    margin: 16,
    gap: 16,
  },
  imageWrapper: {
    position: 'relative',
    gap: 8,
    marginRight: 8,
  },
  registerButton: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
    marginHorizontal: 16,
  },
});

export default ProductRegisterPage;
