import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, BackHandler, Keyboard, Dimensions, TouchableWithoutFeedback, ScrollView, KeyboardEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  lastSeen?: string;
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
  const navigation = useNavigation();
  const [activeView, setActiveView] = useState<'chats' | 'conversation'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
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
  ]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const windowHeight = Dimensions.get('window').height;

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: activeView === 'conversation' ? 'none' : 'flex',
        backgroundColor: theme.background,
        borderTopColor: theme.border,
      }
    });
  }, [navigation, activeView, theme]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (activeView === 'conversation') {
          handleBackToChats();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      const unsubscribeNavListener = navigation.addListener('beforeRemove', (e) => {
        if (activeView === 'conversation') {
          e.preventDefault();
          handleBackToChats();
        }
      });

      return () => {
        subscription.remove();
        unsubscribeNavListener();
      };
    }, [activeView, navigation])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Иванов Сергей Петрович',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      lastMessage: 'Добрый день! Можете скинуть материалы к завтрашней лекции?',
      timestamp: '10:30',
      unread: 2,
      lastSeen: 'был в сети вчера в 23:45'
    },
    {
      id: '2',
      name: 'Староста группы 571',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      lastMessage: 'Завтра пары отменяются! Преподаватель заболел.',
      timestamp: 'Вчера',
      unread: 0,
      lastSeen: 'была в сети 2 часа назад'
    },
    {
      id: '3',
      name: 'Научный руководитель',
      avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
      lastMessage: 'Посмотрите мои комментарии к вашей работе. Нужно доработать третью главу.',
      timestamp: '23.05',
      unread: 1,
      lastSeen: 'онлайн'
    },
    {
      id: '4',
      name: 'Студенческий совет',
      avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
      lastMessage: 'Приглашаем всех на студенческий концерт в субботу!',
      timestamp: '22.05',
      unread: 0,
      lastSeen: 'был в сети 21.05 в 15:30'
    }
  ];

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveView('conversation');
    navigation.setOptions({
      tabBarStyle: { display: 'none' }
    });
  };

  const handleBackToChats = () => {
    setActiveView('chats');
    navigation.setOptions({
      tabBarStyle: { 
        display: 'flex',
        backgroundColor: theme.background,
        borderTopColor: theme.border,
      }
    });
  };

  const filteredMessages = messages.filter(message => {
    if (!selectedChat) return false;
    return message.chatId === selectedChat.id;
  });

  const scrollToBottom = () => {
    if (flatListRef.current && filteredMessages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: selectedChat.id,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
      sent: true,
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    if (filteredMessages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [filteredMessages.length]);

  useEffect(() => {
    function onKeyboardShow(e: KeyboardEvent) {
      const keyboardHeight = e.endCoordinates.height;
      setKeyboardHeight(keyboardHeight);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }

    function onKeyboardHide() {
      setKeyboardHeight(0);
    }

    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardShow
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardHide
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (filteredMessages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [filteredMessages.length]);

  const renderChatsList = () => (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.chatItem, { borderBottomColor: theme.border, backgroundColor: theme.card }]}
          onPress={() => handleChatSelect(item)}
        >
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            defaultSource={{ uri: 'https://via.placeholder.com/50x50' }}
          />
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={[styles.chatName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.timestamp, { color: theme.secondaryText }]}>{item.timestamp}</Text>
            </View>
            <View style={styles.messagePreview}>
              <Text
                numberOfLines={1}
                style={[
                  styles.lastMessage,
                  { color: theme.secondaryText },
                  item.unread > 0 && [styles.unreadMessage, { color: theme.text }]
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

  const renderConversation = () => {
    const windowHeight = Dimensions.get('window').height;
    const bottomPosition = keyboardHeight > 0 ? keyboardHeight : 0;

    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[styles.conversationHeader, { backgroundColor: theme.primary, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToChats}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: selectedChat?.avatar }}
              style={styles.smallAvatar}
              defaultSource={{ uri: 'https://via.placeholder.com/40x40' }}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{selectedChat?.name}</Text>
              <Text style={styles.lastSeenText}>{selectedChat?.lastSeen || 'не в сети'}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: theme.background }}
          contentContainerStyle={{ paddingBottom: Math.max(70, bottomPosition) }}
        >
          {filteredMessages.map(item => (
            <View
              key={item.id}
              style={[
                styles.messageBubble,
                item.sent ? 
                  [styles.sentMessage, { backgroundColor: theme.primary }] : 
                  [styles.receivedMessage, { backgroundColor: theme.card }]
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sent ? { color: '#ffffff' } : { color: theme.text }
                ]}
              >
                {item.text}
              </Text>
              <View style={styles.messageFooter}>
                <Text
                  style={[
                    styles.messageTime,
                    item.sent ? { color: '#e0e0e0' } : { color: theme.secondaryText }
                  ]}
                >
                  {item.timestamp}
                </Text>
                {item.sent && (
                  <AntDesign
                    name={item.read ? "check" : "clockcircleo"}
                    size={12}
                    color={item.read ? "#ffffff" : "#e0e0e0"}
                    style={styles.messageStatus}
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[
          styles.extremeFixedInput,
          { 
            bottom: bottomPosition, 
            backgroundColor: theme.card,
            borderTopColor: theme.border
          }
        ]}>
          <TextInput
            style={[styles.messageInput, { 
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border
            }]}
            placeholder="Сообщение..."
            placeholderTextColor={theme.placeholderText}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={messageText.trim() ? handleSendMessage : undefined}
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
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
        {activeView === 'chats' ? (
          <>
            <HeaderBar title="Сообщения" onMenuPress={() => { }} />
            {renderChatsList()}
          </>
        ) : (
          renderConversation()
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileTextContainer: {
    justifyContent: 'center',
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
  lastSeenText: {
    color: '#e0e0e0',
    fontSize: 12,
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesBox: {
    flex: 1,
  },
  flatListStyle: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  inputBox: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  androidContentContainer: {
    flex: 1,
  },
  androidInputBox: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 5,
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#5181B8',
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
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  messageStatus: {
    marginLeft: 5,
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
  inputFixedContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  extremeFixedInput: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default MessagesScreen; 