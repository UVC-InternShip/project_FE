import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface IMainHeaderProps {
  navigation: NavigationProp<any>;
  logout: () => void;
}

const MainHeader = ({navigation, logout}: IMainHeaderProps): JSX.Element => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{flex: 1, textAlign: 'center'}}>바꾸자고</Text>
      <Icon.Button
        onPress={() => navigation.navigate('Search')}
        name="search"
        backgroundColor={'#fff'}
        color={'#000'}
      />
      <Icon.Button
        onPress={() => console.log('This is a button!')}
        name="notifications"
        backgroundColor={'#fff'}
        color={'#000'}
      />
      <Icon.Button
        onPress={logout}
        name="log-out-outline"
        backgroundColor={'#fff'}
        color={'#000'}
      />
    </View>
  );
};

export default MainHeader;
