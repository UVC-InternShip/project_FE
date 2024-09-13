import React, { useState } from 'react';
import { View, Button, Image, ScrollView, Text, TextInput } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

function MultiImageUpload() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1'); // 기본값 설정
  const [userId, setUserId] = useState('1'); // 기본값 설정
  const [contentsType, setContentsType] = useState('상품');
  const [purpose, setPurpose] = useState('교환');
  const [status, setStatus] = useState('대기중');

  // 이미지 선택 핸들러
  const selectImages = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5, // 최대 5장의 이미지 선택
      },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          setImages(response.assets); // 선택된 이미지 배열로 저장
        }
      }
    );
  };

  console.log('이미지미미미미미미미',images)

  // 이미지와 데이터를 함께 업로드
  const uploadImages = async () => {
    if (images.length === 0 || !title || !description) {
      console.log('모든 필드를 입력하거나 이미지를 선택하세요.');
      return;
    }

    const formData = new FormData();
    // body에 들어갈 다른 데이터 추가
    formData.append('userId', userId);
    formData.append('categoryId', categoryId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('contentsType', contentsType);
    formData.append('purpose', purpose);
    formData.append('status', status);

    // 이미지 파일 추가
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        name: `image${index}.jpg`, // 파일 이름 지정
        type: image.type, // 이미지 MIME 타입 (예: 'image/jpeg', 'image/png')
      });
    });

    console.log('폼데이터', formData)

    try {
      const response = await fetch('http://10.0.2.2:3000/api/contents/register', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('이미지 업로드 결과:', result);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* 제목 입력 */}
      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      {/* 설명 입력 */}
      <TextInput
        placeholder="설명"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {/* 이미지 선택 버튼 */}
      <Button title="이미지 선택" onPress={selectImages} />

      {/* 선택된 이미지 미리 보기 */}
      <ScrollView horizontal>
        {images.map((image, index) => (
          <View key={index} style={{ margin: 5 }}>
            <Image
              source={{ uri: image.uri }}
              style={{ width: 100, height: 100 }}
            />
            <Text>{image.fileName}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 이미지 업로드 버튼 */}
      <Button title="이미지 업로드" onPress={uploadImages} />
    </View>
  );
}

export default MultiImageUpload;
