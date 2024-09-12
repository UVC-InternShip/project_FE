import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function Profile(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>This is Profile Screen</Text>
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

export default Profile;
