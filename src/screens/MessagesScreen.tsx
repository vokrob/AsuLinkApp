import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  chatId: string;
  text: string;
  timestamp: string;
  sent: boolean;
  read: boolean;
}

const MessagesScreen = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<'chats' | 'conversation'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Иванов Сергей Петрович',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      lastMessage: 'Добрый день! Можете скинуть материалы к завтрашней лекции?',
      timestamp: '10:30',
      unread: 2
    },
    {
      id: '2',
      name: 'Староста группы 571',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      lastMessage: 'Завтра пары отменяются! Преподаватель заболел.',
      timestamp: 'Вчера',
      unread: 0
    },
    {
      id: '3',
      name: 'Научный руководитель',
      avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
      lastMessage: 'Посмотрите мои комментарии к вашей работе. Нужно доработать третью главу.',
      timestamp: '23.05',
      unread: 1
    },
    {
      id: '4',
      name: 'Студенческий совет',
      avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
      lastMessage: 'Приглашаем всех на студенческий концерт в субботу!',
      timestamp: '22.05',
      unread: 0
    }
  ];

  const messages: Message[] = [
    {
      id: '101',
      chatId: '1',
      text: 'Здравствуйте, профессор! Можно задать вам вопрос по последней лекции?',
      timestamp: '10:15',
      sent: true,
      read: true
    },
    {
      id: '102',
      chatId: '1',
      text: 'Конечно, задавайте.',
      timestamp: '10:20',
      sent: false,
      read: true
    },
    {
      id: '103',
      chatId: '1',
      text: 'Не могли бы вы объяснить подробнее концепцию, которую рассматривали в конце?',
      timestamp: '10:22',
      sent: true,
      read: true
    },
    {
      id: '104',
      chatId: '1',
      text: 'Добрый день! Можете скинуть материалы к завтрашней лекции?',
      timestamp: '10:30',
      sent: true,
      read: false
    }
  ];

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveView('conversation');
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;
    setMessageText('');
  };

  const filteredMessages = messages.filter(message => {
    if (!selectedChat) return false;
    return message.chatId === selectedChat.id;
  });

  const renderChatsList = () => (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => handleChatSelect(item)}
        >
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            defaultSource={{ uri: 'https://via.placeholder.com/50x50' }}
          />
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <View style={styles.messagePreview}>
              <Text
                numberOfLines={1}
                style={[
                  styles.lastMessage,
                  item.unread > 0 && styles.unreadMessage
                ]}
              >
                {item.lastMessage}
              </Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  const renderConversation = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.conversationContainer}
      keyboardVerticalOffset={100}
    >
      <View style={styles.conversationHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveView('chats')}
        >
          <AntDesign name="arrowleft" size={24} color="#2874A6" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: selectedChat?.avatar }}
            style={styles.smallAvatar}
            defaultSource={{ uri: 'https://via.placeholder.com/40x40' }}
          />
          <Text style={styles.profileName}>{selectedChat?.name}</Text>
        </View>
      </View>

      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        inverted={false}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sent ? styles.sentMessage : styles.receivedMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <View style={styles.messageFooter}>
              <Text style={styles.messageTime}>{item.timestamp}</Text>
              {item.sent && (
                <AntDesign
                  name={item.read ? "check" : "clockcircleo"}
                  size={12}
                  color={item.read ? "#5BC236" : "#999"}
                  style={styles.messageStatus}
                />
              )}
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Сообщение..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.disabledButton
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title="Сообщения" onMenuPress={() => { }} />
      {activeView === 'chats' ? (
        <>
          {renderChatsList()}
        </>
      ) : (
        renderConversation()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#2874A6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversationContainer: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#2874A6',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messagesContainer: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  receivedMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageStatus: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2874A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#9CC3E5',
  },
});

export default MessagesScreen; 