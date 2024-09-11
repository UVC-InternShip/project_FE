import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, ImageURISource, StyleSheet, View} from 'react-native';
import Typo from '../components/Typo';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

function ProductRegisterPage(): JSX.Element {
  const route = useRoute();
  const {type} = route.params as {type: string};

  const [tradeType, setTradeType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<ImageURISource>({uri: ''});

  const pressShotCamera = () => {
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
          const souce = {uri: uri};
          setImage(souce);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.postImageCon}>
        <Typo>이미지</Typo>
      </View>
      <View style={styles.postTitleCon}>
        <Typo>제목</Typo>
      </View>
      <View style={styles.typeCon}>
        <Typo>{type}</Typo>
      </View>
      <View style={styles.postDescCon}>
        <Typo>설명</Typo>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postImageCon: {
    flexDirection: 'row',
  },
  postTitleCon: {
    flexDirection: 'column',
  },
  typeCon: {
    flexDirection: 'column',
  },
  postDescCon: {
    flexDirection: 'column',
  },
});

export default ProductRegisterPage;
