import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function Home(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>This is Home Screen</Text>
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

export default Home;
