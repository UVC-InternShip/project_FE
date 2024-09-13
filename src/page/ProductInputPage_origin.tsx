import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import CustomButton from '../components/Button';
import { launchImageLibrary } from 'react-native-image-picker'; // 갤러리에서 이미지 선택을 위한 함수

function ProductInputPage({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'물물교환' | '나눔' | null>('물물교환'); // 디폴트 선택 설정
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태

  const handleSelectImage = () => {
    // 갤러리에서 이미지 선택
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('사용자가 이미지를 선택하지 않았습니다.');
        } else if (response.errorCode) {
          console.log('이미지 선택 오류:', response.errorMessage);
        } else {
          const imageUri = response.assets[0].uri;
          setSelectedImage(imageUri); // 선택된 이미지 URI 저장
        }
      }
    );
  };

  const handleSubmit = () => {
    if (!title || !description || !transactionType) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    const newProduct = {
      title,
      description,
      transactionType,
      createdAt: new Date().toISOString(),
      image: selectedImage, // 선택된 이미지를 포함
    };

    // 여기에 서버로 API 요청을 보내거나 로컬 상태로 관리할 수 있습니다.
    console.log('상품 입력:', newProduct);

    // 상품 입력 후 이전 화면으로 돌아가기
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 이미지 등록 부분 */}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.cameraIcon} /> // 선택된 이미지 표시
          ) : (
            <View style={styles.placeholderIcon} /> // 이미지가 없을 경우 기본 아이콘
          )}
        </TouchableOpacity>
        <Text style={styles.imageText}>0/5</Text>
      </View>

      {/* 제목 입력 필드 */}
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
      />

      {/* 거래 방식 선택 */}
      <Text style={styles.label}>거래 방식</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            transactionType === '물물교환' && styles.radioButtonSelected,
          ]}
          onPress={() => setTransactionType('물물교환')}
        >
          <Text
            style={
              transactionType === '물물교환'
                ? styles.radioTextSelected
                : styles.radioText
            }
          >
            물물교환
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radioButton,
            transactionType === '나눔' && styles.radioButtonSelected,
          ]}
          onPress={() => setTransactionType('나눔')}
        >
          <Text
            style={
              transactionType === '나눔'
                ? styles.radioTextSelected
                : styles.radioText
            }
          >
            나눔
          </Text>
        </TouchableOpacity>
      </View>

      {/* 상세한 설명 입력 필드 */}
      <Text style={styles.label}>자세한 설명</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="올릴 게시글에 대한 내용을 작성해주세요."
        multiline
        numberOfLines={4}
      />

      {/* 등록 버튼 */}
      <CustomButton onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>등록하기</Text>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#ccc',
    borderRadius: 15,
  },
  cameraIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  imageText: {
    fontSize: 16,
    color: '#888',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioButton: {
    width: 100,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#000',
  },
  radioText: {
    color: '#000',
  },
  radioTextSelected: {
    color: '#fff',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#a42ce4',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductInputPage;
