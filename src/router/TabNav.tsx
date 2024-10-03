import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../page/Home';
import Chat from '../page/chat/Chat';
import Profile from '../page/profile/Profile';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const HomeIcon = <Icon name="home" size={20} />;
const ChatIcon = <Icon name="chatbubbles" size={20} />;
const ProfileIcon = <Icon name="person" size={20} />;
export default function TabNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 모든 페이지의 타이틀 숨기기
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => HomeIcon,
        }}
      />
      <Tab.Screen name="Chat" component={Chat} options={{tabBarIcon: () => ChatIcon}} />
      <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon: () => ProfileIcon}} />
    </Tab.Navigator>
  );
}
