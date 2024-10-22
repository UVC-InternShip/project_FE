import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';

const SplashScreenPage = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/splashLogo.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDEE55',
  },
});

export default SplashScreenPage;
