import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';
import { RoomDetail, CreateRoomReview } from '../types/Campus';
import { campusService } from '../services/campusService';
import { sampleRoomsCorpusL, sampleRoomReviews } from '../data/sampleCampus';

type RoomDetailScreenRouteProp = RouteProp<{
  RoomDetail: { roomId: string };
}, 'RoomDetail'>;

const RoomDetailScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const route = useRoute<RoomDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { roomId } = route.params;

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<CreateRoomReview>({
    rating: 5,
    comment: '',
    category: 'general',
  });

  useEffect(() => {
    loadRoomDetail();
  }, [roomId]);

  const loadRoomDetail = async () => {
    try {
      setLoading(true);

      try {
        const roomDetail = await campusService.getRoom(roomId);
        setRoom(roomDetail);
      } catch (apiError) {
        // Если API недоступен, создаем детали из базовой информации о комнате
        console.log('API unavailable, creating room detail from basic info:', apiError);
        const sampleRoom = sampleRoomsCorpusL.find(r => r.id === roomId);
        if (sampleRoom) {
          const roomDetail: RoomDetail = {
            ...sampleRoom,
            reviews: sampleRoomReviews,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setRoom(roomDetail);
        } else {
          Alert.alert('Ошибка', 'Аудитория не найдена');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error loading room detail:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить информацию об аудитории');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRoomDetail();
    setRefreshing(false);
  };

  const handleCreateReview = async () => {
    if (!room) return;

    try {
      await campusService.createRoomReview(room.id, reviewData);
      Alert.alert('Успех', 'Отзыв добавлен');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '', category: 'general' });
      loadRoomDetail(); // Обновляем данные
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось добавить отзыв');
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'classroom': return { bg: isDarkTheme ? '#1A3A5A' : '#E6F2FF', text: isDarkTheme ? '#81B4FF' : '#0066CC' };
      case 'laboratory': return { bg: isDarkTheme ? '#3A1A5A' : '#F2E6FF', text: isDarkTheme ? '#C281FF' : '#6600CC' };
      case 'lecture': return { bg: isDarkTheme ? '#1A5A3A' : '#E6FFF2', text: isDarkTheme ? '#81FFC2' : '#00CC66' };
      case 'admin': return { bg: isDarkTheme ? '#5A3A1A' : '#FFF2E6', text: isDarkTheme ? '#FFC281' : '#CC6600' };
      case 'computer': return { bg: isDarkTheme ? '#2A2A5A' : '#F0F0FF', text: isDarkTheme ? '#9999FF' : '#4444CC' };
      case 'library': return { bg: isDarkTheme ? '#4A2A2A' : '#FFF0F0', text: isDarkTheme ? '#FF9999' : '#CC4444' };
      case 'conference': return { bg: isDarkTheme ? '#3A3A1A' : '#F5F5E6', text: isDarkTheme ? '#D4D481' : '#B8B800' };
      default: return { bg: '#f0f0f0', text: '#333333' };
    }
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars: React.ReactNode[] = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AntDesign key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<AntDesign key={i} name="staro" size={16} color="#FFD700" />);
      } else {
        stars.push(<AntDesign key={i} name="staro" size={16} color="#DDD" />);
      }
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  if (loading || !room) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
        <HeaderBar title="Загрузка..." onMenuPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Загрузка аудитории...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const typeColors = getRoomTypeColor(room.room_type);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title={`Аудитория ${room.number}`} onMenuPress={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Основная информация об аудитории */}
        <View style={[styles.roomCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <View style={styles.roomHeader}>
            <View style={styles.roomInfo}>
              <Text style={[styles.roomNumber, { color: theme.text }]}>
                Аудитория {room.number}
              </Text>
              <Text style={[styles.buildingInfo, { color: theme.secondaryText }]}>
                {room.building_name}, {room.floor} этаж
              </Text>
            </View>
            <View style={[styles.roomTypeBadge, { backgroundColor: typeColors.bg }]}>
              <Text style={[styles.roomTypeText, { color: typeColors.text }]}>
                {room.room_type_display}
              </Text>
            </View>
          </View>

          <Text style={[styles.roomDescription, { color: theme.text }]}>
            {room.description}
          </Text>

          <View style={styles.roomDetails}>
            <View style={styles.detailRow}>
              <MaterialIcons name="people" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                Вместимость: {room.capacity} человек
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="accessible" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                Доступность: {room.is_accessible ? 'Доступна для людей с ОВЗ' : 'Не адаптирована'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <AntDesign name="star" size={20} color="#FFD700" />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                {room.average_rating > 0 ? `${room.average_rating.toFixed(1)} (${room.reviews.length} отзывов)` : 'Нет оценок'}
              </Text>
            </View>
          </View>

          {/* Оборудование */}
          {room.equipment.length > 0 && (
            <View style={styles.equipmentSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Оборудование:</Text>
              <View style={styles.equipmentList}>
                {room.equipment.map((eq, index) => (
                  <View key={index} style={[styles.equipmentItem, { backgroundColor: theme.primary + '20' }]}>
                    <Text style={[styles.equipmentText, { color: theme.text }]}>{eq}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Действия */}
          <View style={styles.roomActions}>
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowReviewModal(true)}
            >
              <AntDesign name="plus" size={16} color="white" />
              <Text style={styles.reviewButtonText}>Оставить отзыв</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Отзывы */}
        <View style={[styles.reviewsSection, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Отзывы ({room.reviews.length})
          </Text>

          {room.reviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <AntDesign name="message1" size={48} color={theme.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                Пока нет отзывов
              </Text>
            </View>
          ) : (
            room.reviews.map((review) => (
              <View key={review.id} style={[styles.reviewCard, { borderColor: theme.border }]}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewAuthor, { color: theme.text }]}>
                    {review.author.full_name}
                  </Text>
                  {renderRatingStars(review.rating)}
                </View>
                <Text style={[styles.reviewComment, { color: theme.text }]}>
                  {review.comment}
                </Text>
                <Text style={[styles.reviewDate, { color: theme.secondaryText }]}>
                  {new Date(review.created_at).toLocaleDateString('ru-RU')}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Модал для создания отзыва */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Оставить отзыв</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <AntDesign name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingSection}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>Оценка:</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setReviewData({ ...reviewData, rating: star })}
                  >
                    <AntDesign
                      name={star <= reviewData.rating ? "star" : "staro"}
                      size={32}
                      color={star <= reviewData.rating ? "#FFD700" : "#DDD"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.commentSection}>
              <Text style={[styles.commentLabel, { color: theme.text }]}>Комментарий:</Text>
              <TextInput
                style={[styles.commentInput, {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                multiline
                numberOfLines={4}
                placeholder="Поделитесь своим мнением об аудитории..."
                placeholderTextColor={theme.secondaryText}
                value={reviewData.comment}
                onChangeText={(text) => setReviewData({ ...reviewData, comment: text })}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.secondaryText }]}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.primary }]}
                onPress={handleCreateReview}
              >
                <Text style={styles.submitButtonText}>Отправить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  roomCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  roomInfo: {
    flex: 1,
  },
  roomNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buildingInfo: {
    fontSize: 16,
  },
  roomTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  roomTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roomDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  roomDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  equipmentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  roomActions: {
    alignItems: 'flex-end',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  reviewsSection: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
  },
  reviewCard: {
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  commentSection: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoomDetailScreen;
