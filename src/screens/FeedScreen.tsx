import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, Alert, Modal, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HeaderBar from '../components/Navigation/HeaderBar';
import PostItem from '../components/Posts/PostItem';
import PostForm from '../components/Posts/PostForm';
import { Post } from '../types/Post';
import { useTheme } from '../contexts/ThemeContext';
import { MainTabParamList } from '../navigation/AppNavigator';
import { saveData, loadData, KEYS } from '../utils/storage';

const defaultAvatarImage = require('../../assets/Avatar.jpg');

type NavigationProp = StackNavigationProp<MainTabParamList>;

const getPastDate = (daysAgo: number, hours = 0, minutes = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const FeedScreen = () => {
    const justNow = new Date();
    justNow.setMinutes(justNow.getMinutes() - 5);

    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - 2);

    const [posts, setPosts] = useState<Post[]>([]);
    const [notificationCount, setNotificationCount] = useState(2);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [userAvatar, setUserAvatar] = useState<any>(defaultAvatarImage);
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const fetchData = async () => {
            const savedPosts = await loadData<Post[]>(KEYS.POSTS, []);
            const sortedPosts = sortPostsByDate(savedPosts);
            setPosts(sortedPosts);
            await loadUserAvatar();
        };

        fetchData();
    }, []);

    const sortPostsByDate = (postsToSort: Post[]): Post[] => {
        return [...postsToSort].sort((a, b) => {
            const dateA = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as string)) : new Date(0);
            const dateB = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as string)) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    };

    const loadUserAvatar = async () => {
        try {
            const userProfile = await loadData(KEYS.USER_PROFILE, { avatar: defaultAvatarImage });
            const profileAvatar = userProfile.avatar || defaultAvatarImage;
            setUserAvatar(profileAvatar);
            updatePostsWithCurrentAvatar(profileAvatar);
        } catch (error) {
            console.error('Error loading user avatar:', error);
            setUserAvatar(defaultAvatarImage);
        }
    };

    const updatePostsWithCurrentAvatar = (avatar: any) => {
        loadData<Post[]>(KEYS.POSTS, []).then(storedPosts => {
            if (storedPosts && storedPosts.length > 0) {
                const updatedPosts = storedPosts.map(post => {
                    if (post.author === 'Данил Борков') {
                        return { ...post, avatar };
                    }
                    return { ...post, avatar: post.avatar || defaultAvatarImage };
                });

                const sortedUpdatedPosts = sortPostsByDate(updatedPosts);
                setPosts(sortedUpdatedPosts);
                saveData(KEYS.POSTS, sortedUpdatedPosts);
            }
        });
    };

    useEffect(() => {
        const persistPosts = async () => {
            await saveData(KEYS.POSTS, posts);
        };

        persistPosts();
    }, [posts]);

    const handleAddPost = (content: string, imageUri?: string) => {
        if (!content.trim() && !imageUri) return;

        const newPost: Post = {
            id: (Date.now() + Math.random()).toString(),
            author: 'Данил Борков',
            content: content,
            likes: 0,
            comments: 0,
            avatar: userAvatar,
            createdAt: new Date(),
        };

        if (imageUri) {
            newPost.image = imageUri;
        }

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        setModalVisible(false);
    };

    const handleNavigation = (screen: string) => {
        if (screen === 'Profile') {
            navigation.navigate('Profile');
        } else if (screen === 'Messages') {
            navigation.navigate('Messages');
        }
    };

    const handleLikePress = (id: string) => {
        setPosts(posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    const handleDeletePost = (id: string) => {
        Alert.alert(
            "Удалить запись",
            "Вы уверены, что хотите удалить эту запись?",
            [
                {
                    text: "Отмена",
                    style: "cancel"
                },
                {
                    text: "Удалить",
                    style: "destructive",
                    onPress: () => {
                        const updatedPosts = posts.filter(post => post.id !== id);
                        const sortedUpdatedPosts = sortPostsByDate(updatedPosts);
                        setPosts(sortedUpdatedPosts);
                        saveData(KEYS.POSTS, sortedUpdatedPosts);
                    }
                }
            ]
        );
    };

    const handleNotificationPress = () => {
        Alert.alert(
            "Уведомления",
            "У вас 2 новых уведомления:\n\n• Новое сообщение от преподавателя\n• Объявление о предстоящем событии",
            [{ text: "Ок", onPress: () => setNotificationCount(0) }]
        );
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await loadUserAvatar();
            await new Promise(resolve => setTimeout(resolve, 1000));

            const storedPosts = await loadData<Post[]>(KEYS.POSTS, []);
            if (storedPosts) {
                setPosts(sortPostsByDate(storedPosts));
            }
        } catch (error) {
            console.error('Error refreshing feed:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
                <HeaderBar
                    title="Новости"
                    showNotification={true}
                    onNotificationPress={handleNotificationPress}
                    notificationCount={notificationCount}
                    profileAvatar={userAvatar}
                    onProfilePress={handleProfilePress}
                    onAddPress={() => setModalVisible(true)}
                />

                <FlatList
                    data={posts}
                    renderItem={({ item }) => (
                        <PostItem
                            post={item}
                            onLikePress={handleLikePress}
                            onCommentPress={() => { }}
                            onDeletePress={handleDeletePost}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    style={[styles.feedList, { backgroundColor: theme.background }]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.primary]}
                            tintColor={theme.primary}
                            title="Обновление..."
                            titleColor={theme.secondaryText}
                        />
                    }
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>Новая запись</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={[styles.closeButton, { color: theme.text }]}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <PostForm onSubmit={handleAddPost} />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    feedList: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 5,
    },
});

export default FeedScreen;