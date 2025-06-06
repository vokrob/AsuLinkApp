import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Post } from '../../types/Post';
import { formatVkStyle } from '../../utils/dateFormat';
import { useTheme } from '../../contexts/ThemeContext';

interface PostItemProps {
  post: Post;
  onLikePress?: (id: string) => void;
  onCommentPress?: (id: string) => void;
  onDeletePress?: (id: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLikePress, onCommentPress, onDeletePress }) => {
  const { theme } = useTheme();
  const formattedDate = post.createdAt ? formatVkStyle(post.createdAt) : '';
  const [fullScreenImage, setFullScreenImage] = useState(false);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <RectButton style={styles.deleteButton} onPress={() => onDeletePress && onDeletePress(post.id)}>
        <Animated.View
          style={[
            styles.deleteAction,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.actionText}>Удалить</Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <View style={[styles.postContainer, { backgroundColor: theme.card }]}>
        <View style={styles.headerContainer}>
          {post.avatar ? (
            <Image
              source={typeof post.avatar === 'string' ? { uri: post.avatar } : post.avatar}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <View style={styles.authorInfo}>
            <Text style={[styles.author, { color: theme.text }]}>{post.author}</Text>
            {formattedDate ? <Text style={[styles.date, { color: theme.secondaryText }]}>{formattedDate}</Text> : null}
          </View>
        </View>

        {post.content ? (
          <Text style={[styles.content, { color: theme.text }]}>{post.content}</Text>
        ) : null}

        {post.image ? (
          <View style={[
            styles.imageContainer,
            !post.content && styles.imageContainerNoContent
          ]}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setFullScreenImage(true)}
            >
              <Image
                source={{ uri: post.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <Modal
          visible={fullScreenImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFullScreenImage(false)}
        >
          <View style={styles.fullScreenContainer}>
            <TouchableOpacity
              style={styles.fullScreenTouchable}
              activeOpacity={1}
              onPress={() => setFullScreenImage(false)}
            >
              <Image
                source={{ uri: post.image }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.interactions}>
          <View style={styles.leftInteractions}>
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => onLikePress && onLikePress(post.id)}
            >
              <AntDesign name="like2" size={24} color={theme.secondaryText} />
              <Text style={[styles.interactionText, { color: theme.secondaryText }]}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => onCommentPress && onCommentPress(post.id)}
            >
              <AntDesign name="message1" size={24} color={theme.secondaryText} />
              <Text style={[styles.interactionText, { color: theme.secondaryText }]}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewsContainer}>
            <AntDesign name="eye" size={18} color={theme.secondaryText} />
            <Text style={[styles.viewsText, { color: theme.secondaryText }]}>{post.views || 0}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT = height;

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  imageContainer: {
    width: width,
    marginHorizontal: -15,
    marginBottom: 10,
  },
  imageContainerNoContent: {
    marginTop: 0,
  },
  image: {
    width: width,
    height: SCREEN_HEIGHT * 0.6,
    marginBottom: 0,
  },
  interactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  leftInteractions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  interactionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#777',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#777',
  },
  deleteButton: {
    marginBottom: 20,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteAction: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 80,
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default PostItem; 