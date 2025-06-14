import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';
import { Building, Room, RoomDetail, CreateRoomReview } from '../types/Campus';
import { campusService } from '../services/campusService';

const MapScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const [activeView, setActiveView] = useState<'buildings' | 'rooms' | 'room-detail'>('buildings');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<CreateRoomReview>({
    rating: 5,
    comment: '',
    category: 'general',
  });

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      const buildingsData = await campusService.getBuildings();
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error loading buildings:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить корпуса');
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async (buildingId: string) => {
    try {
      setLoading(true);
      const roomsData = await campusService.getRooms({ building: buildingId });
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading rooms:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить аудитории');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomDetail = async (roomId: string) => {
    try {
      setLoading(true);
      const roomDetail = await campusService.getRoom(roomId);
      setSelectedRoom(roomDetail);
      setActiveView('room-detail');
    } catch (error) {
      console.error('Error loading room detail:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить информацию об аудитории');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeView === 'buildings') {
      await loadBuildings();
    } else if (activeView === 'rooms' && selectedBuilding) {
      await loadRooms(selectedBuilding.id);
    }
    setRefreshing(false);
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    setActiveView('rooms');
    loadRooms(building.id);
  };

  const handleRoomSelect = (room: Room) => {
    loadRoomDetail(room.id);
  };

  const handleCreateReview = async () => {
    if (!selectedRoom) return;

    try {
      await campusService.createRoomReview(selectedRoom.id, reviewData);
      Alert.alert('Успех', 'Отзыв добавлен');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '', category: 'general' });
      // Перезагружаем детали аудитории
      loadRoomDetail(selectedRoom.id);
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

  const renderBuildingsList = () => (
    <ScrollView
      style={[styles.contentContainer, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
    >
      {loading && buildings.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Загрузка корпусов...</Text>
        </View>
      ) : buildings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="business" size={64} color={theme.secondaryText} />
          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>Нет доступных корпусов</Text>
        </View>
      ) : (
        buildings.map(building => (
          <TouchableOpacity
            key={building.id}
            style={[styles.buildingCard, {
              backgroundColor: theme.card,
              shadowColor: theme.text
            }]}
            onPress={() => handleBuildingSelect(building)}
          >
            {building.image && (
              <Image
                source={{ uri: building.image }}
                style={styles.buildingImage}
              />
            )}
            <View style={styles.buildingInfo}>
              <Text style={[styles.buildingName, { color: theme.text }]}>{building.name}</Text>
              <View style={styles.addressRow}>
                <MaterialIcons name="location-on" size={16} color={theme.secondaryText} />
                <Text style={[styles.buildingAddress, { color: theme.secondaryText }]}>{building.address}</Text>
              </View>
              <Text style={[styles.buildingDescription, { color: theme.text }]} numberOfLines={2}>
                {building.description}
              </Text>
              <View style={styles.buildingStats}>
                {renderRatingStars(building.average_rating)}
                <Text style={[styles.statsText, { color: theme.secondaryText }]}>
                  {building.total_rooms} аудиторий
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderRoomsList = () => {
    return (
      <View style={[styles.roomsContainer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.backToBuildings, { borderBottomColor: theme.border }]}
          onPress={() => setActiveView('buildings')}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          <Text style={[styles.backText, { color: theme.primary }]}>К списку корпусов</Text>
        </TouchableOpacity>

        {selectedBuilding && (
          <View style={[styles.buildingHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.buildingHeaderTitle, { color: theme.text }]}>
              {selectedBuilding.name}
            </Text>
            <Text style={[styles.buildingHeaderAddress, { color: theme.secondaryText }]}>
              {selectedBuilding.address}
            </Text>
          </View>
        )}

        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
          renderItem={({ item }) => {
            const typeColors = getRoomTypeColor(item.room_type);
            return (
              <TouchableOpacity
                style={[styles.roomCard, {
                  backgroundColor: theme.card,
                  shadowColor: theme.text
                }]}
                onPress={() => handleRoomSelect(item)}
              >
                <View style={styles.roomHeader}>
                  <View style={styles.roomInfo}>
                    <Text style={[styles.roomNumber, { color: theme.text }]}>
                      Аудитория {item.number}
                    </Text>
                    <Text style={[styles.floorInfo, { color: theme.secondaryText }]}>
                      Этаж: {item.floor}
                    </Text>
                  </View>
                  <View style={[styles.roomTypeBadge, { backgroundColor: typeColors.bg }]}>
                    <Text style={[styles.roomTypeText, { color: typeColors.text }]}>
                      {item.room_type_display}
                    </Text>
                  </View>
                </View>

                <View style={styles.roomDetails}>
                  <View style={styles.roomDetail}>
                    <MaterialIcons name="people" size={16} color={theme.secondaryText} />
                    <Text style={[styles.roomDetailText, { color: theme.secondaryText }]}>
                      Вместимость: {item.capacity} чел.
                    </Text>
                  </View>
                  <View style={styles.roomDetail}>
                    <AntDesign name="star" size={16} color="#FFD700" />
                    <Text style={[styles.roomDetailText, { color: theme.secondaryText }]}>
                      {item.average_rating > 0 ? item.average_rating.toFixed(1) : 'Нет оценок'}
                    </Text>
                  </View>
                  <View style={styles.roomDetail}>
                    <AntDesign name="message1" size={16} color={theme.secondaryText} />
                    <Text style={[styles.roomDetailText, { color: theme.secondaryText }]}>
                      {item.reviews_count} отзывов
                    </Text>
                  </View>
                </View>

                {item.equipment.length > 0 && (
                  <View style={styles.equipmentContainer}>
                    <Text style={[styles.equipmentTitle, { color: theme.text }]}>Оборудование:</Text>
                    <View style={styles.equipmentList}>
                      {item.equipment.slice(0, 3).map((eq, index) => (
                        <View key={index} style={[styles.equipmentItem, { backgroundColor: theme.primary + '20' }]}>
                          <Text style={[styles.equipmentText, { color: theme.text }]}>{eq}</Text>
                        </View>
                      ))}
                      {item.equipment.length > 3 && (
                        <Text style={[styles.moreEquipment, { color: theme.secondaryText }]}>
                          +{item.equipment.length - 3} еще
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.roomActions}>
                  <TouchableOpacity
                    style={[styles.reviewButton, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      setSelectedRoom({ ...item } as RoomDetail);
                      setShowReviewModal(true);
                    }}
                  >
                    <AntDesign name="plus" size={16} color="white" />
                    <Text style={styles.reviewButtonText}>Оставить отзыв</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="meeting-room" size={64} color={theme.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                {loading ? 'Загрузка аудиторий...' : 'Нет доступных аудиторий'}
              </Text>
            </View>
          }
        />
      </View>
    );
  };

  const renderReviewModal = () => (
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
            <Text style={[styles.ratingLabel, { color: theme.text }]}>Общая оценка:</Text>
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
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title="Карта кампуса" onMenuPress={() => { }} />
      {activeView === 'buildings' ? renderBuildingsList() : renderRoomsList()}
      {renderReviewModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  buildingCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buildingImage: {
    width: 120,
    height: 120,
  },
  buildingInfo: {
    flex: 1,
    padding: 12,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  buildingAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  buildingDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  buildingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  roomsContainer: {
    flex: 1,
  },
  backToBuildings: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    marginLeft: 5,
    color: '#2874A6',
    fontSize: 16,
  },
  buildingHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buildingHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buildingHeaderAddress: {
    fontSize: 14,
    color: '#666',
  },
  roomCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  floorInfo: {
    fontSize: 14,
    color: '#666',
  },
  roomTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  roomTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roomDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  roomDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  roomDetailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  equipmentContainer: {
    marginBottom: 12,
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  equipmentItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  equipmentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreEquipment: {
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  roomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
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
    backgroundColor: 'white',
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

export default MapScreen; 