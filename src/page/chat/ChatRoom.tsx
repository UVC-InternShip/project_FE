// CHECKLIST
// DESC 1. 채팅 방에 대한 페이지.
import React, {useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, View} from 'react-native';
import io from 'socket.io-client';

interface IChatMessage {
  senderId: number;
  message: string;
  timestamp: string;
}

function ChatRoom(): JSX.Element {
  const route = useRoute();
  const {userId, writerId, productId, chatRoomId} = route.params as {
    userId: number;
    writerId: number;
    productId: number;
    chatRoomId: string;
  };

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');
  const socketRef = useRef<any>(null);
  const socketUrl = 'http://10.0.2.2:3000';

  useEffect(() => {
    const socket = io(socketUrl); // 서버 URL로 변경
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('소켓 연결 성공');
    });

    socket.on('connect_error', (error: any) => {
      console.error('소켓 연결 오류:', error);
    });

    socket.emit('join-chat', {userId, chatRoomId});
    console.log('joined chat', {userId, chatRoomId});

    socket.on('chat-history', data => {
      console.log('chat-history 수신됨:', data);
      if (data && data.message) {
        setMessages(
          data.message.map((el: any) => ({
            senderId: el.senderId,
            message: el.message,
            timestamp: new Date(el.timestamp),
          })),
        );
        // 메시지 상태 업데이트
      } else {
        console.log('메시지 데이터가 없습니다.');
      }
    });

    socket.on('receive-message', newMessage => {
      // const formattedMessage = {
      //   senderId: newMessage.senderId,
      //   message: newMessage.message,
      //   timestamp: new Date(),
      // };
      setMessages(prevMessages => [...prevMessages, ...newMessage]);
    });

    return () => {
      console.log('소켓 연결 해제');
      socket.disconnect();
    };
  }, [userId, chatRoomId]);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      const newMessage = {
        senderId: userId, // 메시지 전송 시 senderId 설정
        message: message,
        timestamp: new Date().toString(),
      };
      socketRef.current.emit('message-send', {
        userId: userId,
        chatRoomId: chatRoomId,
        message: message,
      });
      console.log('메시지 전송:', newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]); // 메시지 상태 업데이트
      setMessage('');
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={messages}
        renderItem={({item}) => (
          <View
            style={{
              alignSelf: item.senderId === userId ? 'flex-end' : 'flex-start', // 사용자 메시지는 우측, 상대방은 좌측
              marginVertical: 5,
              marginHorizontal: 10,
              backgroundColor: item.senderId === userId ? '#0084ff' : '#e5e5ea', // 색상 변경
              borderRadius: 10,
              padding: 10,
              maxWidth: '80%', // 메시지 최대 너비
            }}>
            <Text style={{color: item.senderId === userId ? 'white' : 'red'}}>{item.message}</Text>
            <Text style={{color: 'gray', fontSize: 10}}>
              {new Date(item.timestamp).toLocaleTimeString()} {/* 타임스탬프 추가 */}
            </Text>
          </View>
        )}
        keyExtractor={item => item.timestamp}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요"
        style={{padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5}}
      />
      <Button title="전송" onPress={sendMessage} />
    </View>
  );
}

export default ChatRoom;