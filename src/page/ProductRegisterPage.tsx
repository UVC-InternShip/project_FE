import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Typo from '../components/Typo';

function ProductRegisterPage(): JSX.Element {
  const route = useRoute();
  const {type} = route.params as {type: string};

  const [tradeType, setTradeType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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
