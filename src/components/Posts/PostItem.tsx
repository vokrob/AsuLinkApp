import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, Modal, ActivityIndicator } from 'react-native';
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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Функция для проверки, является ли изображение SVG
  const isSvgImage = (url: string): boolean => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('.svg') || lowerUrl.includes('svg');
  };

  // Функция для проверки, должно ли изображение отображаться
  const shouldDisplayImage = (imageUrl: string): boolean => {
    if (!imageUrl || imageUrl.trim() === '') return false;
    return !isSvgImage(imageUrl);
  };

  // Отладочная информация
  console.log('PostItem rendered:', {
    id: post.id,
    author: post.author,
    hasImage: !!post.image,
    imageUrl: post.image,
    isSvg: post.image ? isSvgImage(post.image) : false,
    shouldDisplay: post.image ? shouldDisplayImage(post.image) : false
  });

  // Сброс состояния при изменении изображения
  useEffect(() => {
    if (post.image && shouldDisplayImage(post.image)) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [post.image]);

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

        {post.image && shouldDisplayImage(post.image) ? (
          <View style={[
            styles.imageContainer,
            !post.content && styles.imageContainerNoContent
          ]}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setFullScreenImage(true)}
            >
              {/* Индикатор загрузки */}
              {imageLoading && !imageError && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                </View>
              )}

              {/* Отображение ошибки или изображения */}
              {imageError ? (
                <View style={styles.imageErrorContainer}>
                  <Text style={[styles.imageErrorText, { color: theme.secondaryText }]}>
                    Изображение недоступно
                  </Text>
                  <Text style={[styles.imageUrlText, { color: theme.secondaryText }]}>
                    {post.image}
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: post.image }}
                  style={styles.image}
                  resizeMode="contain"
                  onError={(error) => {
                    console.log('Image loading error:', error.nativeEvent);
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', post.image);
                    setImageLoading(false);
                    setImageError(false);
                  }}
                  onLoadStart={() => {
                    setImageLoading(true);
                    setImageError(false);
                  }}
                />
              )}
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
    minHeight: 200,
    maxHeight: 400,
    marginBottom: 0,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  imageErrorContainer: {
    width: width,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageErrorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  imageUrlText: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.7,
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