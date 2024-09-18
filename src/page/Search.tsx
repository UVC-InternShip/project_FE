import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


// TODO
// [ ] 검색 페이지 마크업 및 스타일링
// DESC 검색 페이지는 물물교환과 나눔으로 구분된다.
// [ ] 검색 페이지 API 연동

function SearchPage(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>This is Search Screen</Text>
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
});

export default SearchPage;
