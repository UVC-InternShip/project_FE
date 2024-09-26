// CHECKLIST
// DESC 1. 채팅 방에 대한 페이지.
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, View} from 'react-native';
import io from 'socket.io-client';
import {API_URL} from '../../config';

// const pressShareChat = () => {
//     navigation.navigate('ChatRoom', {
//       userId: productOwnerId,
//       writerId: userId,
//       productId: productId,
//     });
//   };

function ChatRoom(): JSX.Element {
  const route = useRoute();
  const {userId, writerId, productId, chatRoomId} = route.params as {
    userId: number;
    writerId: number;
    productId: number;
    chatRoomId: string;
  };
  //   const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const socket = io('http://localhost:3000'); // 서버 URL로 변경
    console.log('소켓 연결됨', socket);

    socket.emit('join-chat', {userId, chatRoomId});

    socket.on('chat-history', (chatHistory: string[]) => {
      setMessages(chatHistory);
    });

    socket.on('receive-message', (newMessage: string) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, chatRoomId]);

  const sendMessage = () => {
    if (message.trim()) {
      const socket = io('http://localhost:3000');
      socket.emit('message-send', {
        userId: userId,
        chatRoomId: chatRoomId,
        message: message,
      });
      console.log(userId, chatRoomId, message);
      console.log('메시지 전송:', message);
      setMessage('');
    }
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput value={message} onChangeText={setMessage} placeholder="메시지를 입력하세요" />
      <Button title="전송" onPress={sendMessage} />
    </View>
  );
}

export default ChatRoom;