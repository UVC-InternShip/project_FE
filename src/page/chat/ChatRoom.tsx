// CHECKLIST
// DESC 1. 채팅 방에 대한 페이지.
import React, {useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Button, Dimensions, FlatList, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import io from 'socket.io-client';

interface IChatMessage {
  senderId: number;
  message: string;
  timestamp: string;
}

interface IChatInfo {
  itemId: number;
  writerId: number;
  requesterId: number;
}

interface IChatProductInfo {
  title: string;
  firstImage: {
    imageUrl: string;
    order: number;
  };
  description: string;
  status: string;
}

function ChatRoom(): JSX.Element {
  const route = useRoute();
  const {userId, writerId, productId, chatRoomId} = route.params as {
    userId: number;
    writerId: number;
    productId: number;
    chatRoomId: string;
  };
  console.log('chatRoomId', chatRoomId);
  console.log('writerId', writerId);
  console.log('productId', productId);
  console.log('userId', userId);

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');
  const [chatInfo, setChatInfo] = useState<IChatInfo>();
  const [chatProduct, setChatProduct] = useState<IChatProductInfo[]>([]);
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
      console.log('chat-history fetch');
      setChatInfo({
        itemId: data.chatInfo.itemId,
        writerId: data.chatInfo.member[0],
        requesterId: data.chatInfo.member[1],
      });
      if (data && data.contentInfo.length > 1) {
        setChatProduct([
          {
            title: data.contentInfo[0].title,
            firstImage: {
              imageUrl: data.contentInfo[0].firstImage[0].imageUrl,
              order: data.contentInfo[0].firstImage[0].order,
            },
            description: data.contentInfo[0].description,
            status: data.contentInfo[0].status,
          },
          {
            title: data.contentInfo[1].title,
            firstImage: {
              imageUrl: data.contentInfo[1].firstImage.imageUrl,
              order: data.contentInfo[1].firstImage.order,
            },
            description: data.contentInfo[1].description,
            status: data.contentInfo[1].status,
          },
        ]);
      } else {
        setChatProduct([
          {
            title: data.contentInfo[0].title,
            firstImage: {
              imageUrl: data.contentInfo[0].firstImage.imageUrl,
              order: data.contentInfo[0].firstImage.order,
            },
            description: data.contentInfo[0].description,
            status: data.contentInfo[0].status,
          },
        ]);
      }
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
      console.log('receive-message 수신된 데이터:', newMessage);
      // const formattedMessage = {
      //   senderId: newMessage.senderId,
      //   message: newMessage.message,
      //   timestamp: new Date(),
      // };
      if (newMessage && newMessage.senderId !== userId) {
        console.log('메시지 수신');
        setMessages(prevMessages => [...prevMessages, newMessage]); // 상태 업데이트
      }
    });

    return () => {
      console.log('소켓 연결 해제');
      socket.disconnect();
    };
  }, [userId, chatRoomId]);
  console.log('채팅방정보', chatInfo);
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
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleTrade = () => {
    console.log('거래하기 버튼 클릭');
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.productContainer}>
        {chatProduct.map((product, index) => (
          <View key={index} style={styles.productCard}>
            <Image source={{uri: product.firstImage.imageUrl}} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>
          </View>
        ))}
      </View>
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
            <Text style={{color: item.senderId === userId ? 'white' : 'black'}}>
              {item.message}
            </Text>
            <Text style={{color: 'black', fontSize: 10}}>
              {new Date(item.timestamp).toLocaleTimeString()} {/* 타임스탬프 추가 */}
            </Text>
          </View>
        )}
        keyExtractor={item => item.timestamp}
      />
      {chatInfo && chatInfo.writerId === userId && (
        <Button title="거래하기" onPress={handleTrade} />
      )}
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

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.1,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  productImage: {
    width: '30%',
    height: '100%',
  },
  productInfo: {
    padding: 10,
    justifyContent: 'center',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatRoom;
