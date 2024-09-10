import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomButton from '../components/Button';
import Typo from '../components/Typo';
import {useProductList} from '../store/query/useGetProductList';

function Home(): JSX.Element {
  const pressBtn = () => {
    console.log('Button Pressed');
  };
  const {isLoading, data: products} = useProductList();

  return (
    <View style={styles.container}>
      <Text>This is Home Screen</Text>
      <CustomButton style={styles.buttonContainer} onPress={pressBtn}>
        <Typo color="black">물건 등록</Typo>
      </CustomButton>
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
});

export default Home;
