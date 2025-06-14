import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';
import { Event, EventReview } from '../types/Event';
import { eventService } from '../services/eventService';
import { sampleEventsData, sampleEventReviews } from '../data/sampleEvents';

type EventDetailScreenRouteProp = RouteProp<{
  EventDetail: { eventId: string };
}, 'EventDetail'>;

const EventDetailScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const route = useRoute<EventDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    loadEventDetail();
  }, [eventId]);

  const loadEventDetail = async () => {
    try {
      setLoading(true);

      try {
        const eventDetail = await eventService.getEvent(eventId);
        setEvent(eventDetail);
        setReviews(eventDetail.reviews || []);
      } catch (apiError) {
        // Если API недоступен, используем примеры данных
        console.log('API unavailable, using sample data:', apiError);
        const sampleEvent = sampleEventsData.find(e => e.id === eventId);
        if (sampleEvent) {
          setEvent(sampleEvent);
          setReviews(sampleEventReviews);
        } else {
          Alert.alert('Ошибка', 'Событие не найдено');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error loading event detail:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить информацию о событии');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEventDetail();
    setRefreshing(false);
  };

  const handleJoinEvent = async () => {
    if (!event) return;

    try {
      await eventService.joinEvent(event.id);
      loadEventDetail(); // Обновляем данные
    } catch (error: any) {
      console.error('Error joining event:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось присоединиться к событию');
    }
  };

  const handleLeaveEvent = async () => {
    if (!event) return;

    try {
      await eventService.leaveEvent(event.id);
      loadEventDetail(); // Обновляем данные
    } catch (error: any) {
      console.error('Error leaving event:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось покинуть событие');
    }
  };

  const handleCreateReview = async () => {
    if (!event) return;

    try {
      await eventService.createEventReview(event.id, reviewData);
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      loadEventDetail(); // Обновляем данные
    } catch (error: any) {
      console.error('Ошибка при создании отзыва:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось добавить отзыв');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString('ru-RU');
    const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: timeStr };
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      university: { bg: isDarkTheme ? '#1A3A5A' : '#E6F2FF', text: isDarkTheme ? '#81B4FF' : '#0066CC' },
      personal: { bg: isDarkTheme ? '#5A1A1A' : '#FFE6E6', text: isDarkTheme ? '#FF8181' : '#CC0000' },
      academic: { bg: isDarkTheme ? '#2A4A2A' : '#E6F7E6', text: isDarkTheme ? '#81C781' : '#006600' },
      cultural: { bg: isDarkTheme ? '#4A2A5A' : '#F2E6FF', text: isDarkTheme ? '#B481FF' : '#6600CC' },
      sports: { bg: isDarkTheme ? '#5A3A1A' : '#FFF2E6', text: isDarkTheme ? '#FFB481' : '#CC6600' },
      workshop: { bg: isDarkTheme ? '#3A2A1A' : '#F5F2E6', text: isDarkTheme ? '#D4C281' : '#B8860B' },
      exam: { bg: isDarkTheme ? '#5A2A2A' : '#FFE6E6', text: isDarkTheme ? '#FF9999' : '#CC4444' },
    };
    return colors[category] || colors.university;
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      university: 'Университет',
      personal: 'Личное',
      academic: 'Учебное',
      cultural: 'Культурное',
      sports: 'Спортивное',
      conference: 'Конференция',
      workshop: 'Мастер-класс',
      meeting: 'Встреча',
      exam: 'Экзамен',
      deadline: 'Дедлайн',
    };
    return names[category] || category;
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

  if (loading || !event) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
        <HeaderBar title="Загрузка..." onMenuPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Загрузка события...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { date, time } = formatDateTime(event.start_datetime);
  const categoryColors = getCategoryColor(event.category);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title="Детали события" onMenuPress={() => navigation.goBack()} />
      
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
        {/* Основная информация о событии */}
        <View style={[styles.eventCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <View style={styles.eventHeader}>
            <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}>
              <Text style={[styles.categoryText, { color: categoryColors.text }]}>
                {getCategoryName(event.category)}
              </Text>
            </View>
          </View>

          <Text style={[styles.eventDescription, { color: theme.text }]}>
            {event.description}
          </Text>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <AntDesign name="calendar" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>{date}</Text>
            </View>
            <View style={styles.detailRow}>
              <AntDesign name="clockcircleo" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>{time}</Text>
            </View>
            <View style={styles.detailRow}>
              <AntDesign name="enviromento" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>{event.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <AntDesign name="user" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                {event.participants_count} участников
              </Text>
            </View>
            <View style={styles.detailRow}>
              <AntDesign name="team" size={20} color={theme.secondaryText} />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                Организатор: {event.organizer.full_name}
              </Text>
            </View>
            {event.average_rating > 0 && (
              <View style={styles.detailRow}>
                <AntDesign name="star" size={20} color="#FFD700" />
                <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                  {event.average_rating.toFixed(1)} ({reviews.length} отзывов)
                </Text>
              </View>
            )}
          </View>

          {/* Действия */}
          <View style={styles.eventActions}>
            {event.user_is_participant ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.leaveButton]}
                onPress={handleLeaveEvent}
              >
                <Text style={styles.leaveButtonText}>Покинуть событие</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={handleJoinEvent}
              >
                <Text style={styles.joinButtonText}>Присоединиться</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.reviewButton, { borderColor: theme.primary }]}
              onPress={() => setShowReviewModal(true)}
            >
              <AntDesign name="plus" size={16} color={theme.primary} />
              <Text style={[styles.reviewButtonText, { color: theme.primary }]}>Оставить отзыв</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Отзывы */}
        <View style={[styles.reviewsSection, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Отзывы ({reviews.length})
          </Text>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <AntDesign name="message1" size={48} color={theme.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                Пока нет отзывов
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
                <View key={review.id} style={[styles.reviewCard, { borderColor: theme.border }]}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.authorInfo}>
                      <View style={styles.avatarContainer}>
                        {review.author?.avatar_url ? (
                          <Image
                            source={{ uri: review.author.avatar_url }}
                            style={styles.authorAvatar}
                            onError={(error) => console.log('Avatar load error:', error)}
                          />
                        ) : (
                          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                            <Text style={styles.avatarText}>
                              {review.author?.full_name ?
                                review.author.full_name.split(' ').map(name => name[0]).join('').toUpperCase()
                                : '??'
                              }
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.authorDetails}>
                        <Text style={[styles.reviewAuthor, { color: theme.text }]}>
                          {review.author?.full_name || 'Неизвестный автор'}
                        </Text>
                        <Text style={[styles.reviewDate, { color: theme.secondaryText }]}>
                          {new Date(review.created_at).toLocaleDateString('ru-RU')}
                        </Text>
                      </View>
                    </View>
                    {renderRatingStars(review.rating)}
                  </View>
                  <Text style={[styles.reviewComment, { color: theme.text }]}>
                    {review.comment}
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
                placeholder="Поделитесь своим мнением о событии..."
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
  eventCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  eventDetails: {
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
  eventActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveButton: {
    backgroundColor: '#FF6B6B',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  leaveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  reviewButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsSection: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorDetails: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    marginLeft: 52, // Выравниваем с текстом автора
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

export default EventDetailScreen;
