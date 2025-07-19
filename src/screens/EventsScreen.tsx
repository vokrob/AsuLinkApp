import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';
import { Event } from '../types/Event';
import { eventService } from '../services/eventService';
import { sampleEventsData } from '../data/sampleEvents';

const EventsScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'all' | 'university' | 'personal'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);



  useEffect(() => {
    loadEvents();
  }, []); // Загружаем события только один раз при монтировании

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading events...');

      // ВРЕМЕННО: Всегда используем sample данные, пока API не готов
      console.log('📊 Using sample events data');
      console.log('Sample events count:', sampleEventsData.length);
      setEvents(sampleEventsData);

      /* Отключаем API пока не исправим backend
      try {
        const eventsData = await eventService.getEvents();
        console.log('Events data received:', eventsData);

        if (Array.isArray(eventsData) && eventsData.length > 0) {
          console.log('✅ Setting events from API');
          setEvents(eventsData);
        } else if (eventsData && Array.isArray((eventsData as any).results) && (eventsData as any).results.length > 0) {
          console.log('✅ Setting events from API results');
          setEvents((eventsData as any).results);
        } else {
          console.log('⚠️ API returned empty, using sample data');
          setEvents(sampleEventsData);
        }
      } catch (apiError) {
        console.log('❌ API unavailable, using sample data:', apiError);
        setEvents(sampleEventsData);
      }
      */
    } catch (error) {
      console.error('💥 Error loading events:', error);
      setEvents(sampleEventsData);
    } finally {
      setLoading(false);
      console.log('✅ Events loading completed');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };



  const handleJoinEvent = async (eventId: string) => {
    try {
      await eventService.joinEvent(eventId);
      loadEvents(); // Обновляем список
    } catch (error: any) {
      console.error('Error joining event:', error);
      // Согласно предпочтениям пользователя - без показа сообщений об ошибках
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await eventService.leaveEvent(eventId);
      loadEvents(); // Обновляем список
    } catch (error: any) {
      console.error('Error leaving event:', error);
      // Согласно предпочтениям пользователя - без показа сообщений об ошибках
    }
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail' as never, { eventId } as never);
  };

  const handleReviewsPress = (eventId: string) => {
    navigation.navigate('EventDetail' as never, { eventId } as never);
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
      conference: { bg: isDarkTheme ? '#2A3A2A' : '#E6F5E6', text: isDarkTheme ? '#81D481' : '#228B22' },
      meeting: { bg: isDarkTheme ? '#3A1A3A' : '#F2E6F2', text: isDarkTheme ? '#C281C2' : '#8B008B' },
      exam: { bg: isDarkTheme ? '#5A2A2A' : '#FFE6E6', text: isDarkTheme ? '#FF9999' : '#CC4444' },
      deadline: { bg: isDarkTheme ? '#5A1A3A' : '#FFE6F2', text: isDarkTheme ? '#FF81C2' : '#CC0066' },
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

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') {
      return true;
    }
    if (activeTab === 'university') {
      // Университетские события включают: university, academic, cultural, sports, exam
      return ['university', 'academic', 'cultural', 'sports', 'exam', 'conference'].includes(event.category);
    }
    if (activeTab === 'personal') {
      // Личные события включают: personal, workshop, meeting, deadline
      return ['personal', 'workshop', 'meeting', 'deadline'].includes(event.category);
    }
    return event.category === activeTab;
  });

  // Логирование для отладки (можно убрать в продакшене)
  if (events.length > 0) {
    console.log(`📊 Events: ${events.length} total, ${filteredEvents.length} filtered (tab: ${activeTab})`);
  }

  const renderEventCard = ({ item }: { item: Event }) => {
    const { date, time } = formatDateTime(item.start_datetime);
    const categoryColors = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={[styles.eventCard, { backgroundColor: theme.card, shadowColor: theme.text }]}
        onPress={() => handleEventPress(item.id)}
      >
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, { color: theme.text }]}>{item.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}>
            <Text style={[styles.categoryText, { color: categoryColors.text }]}>
              {getCategoryName(item.category)}
            </Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <AntDesign name="calendar" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>{date}</Text>
          </View>
          <View style={styles.detailRow}>
            <AntDesign name="clockcircleo" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>{time}</Text>
          </View>
          <View style={styles.detailRow}>
            <AntDesign name="enviromento" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <AntDesign name="user" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {item.participants_count} участников
            </Text>
          </View>
          {item.average_rating > 0 && (
            <View style={styles.detailRow}>
              <AntDesign name="star" size={16} color="#FFD700" />
              <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                {item.average_rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.eventDescription, { color: theme.text }]} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.eventActions}>
          {item.user_is_participant ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.leaveButton]}
              onPress={() => handleLeaveEvent(item.id)}
            >
              <Text style={styles.leaveButtonText}>Покинуть</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => handleJoinEvent(item.id)}
            >
              <Text style={styles.joinButtonText}>Присоединиться</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => handleReviewsPress(item.id)}
          >
            <AntDesign name="message1" size={16} color={theme.primary} />
            <Text style={[styles.reviewButtonText, { color: theme.primary }]}>Отзывы</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title="Events" onMenuPress={() => { }} />



      {/* Переключатель вида */}
      <View style={[styles.viewModeContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'list' && { backgroundColor: theme.primary }]}
          onPress={() => setViewMode('list')}
        >
          <AntDesign
            name="bars"
            size={20}
            color={viewMode === 'list' ? 'white' : theme.secondaryText}
          />
          <Text style={[
            styles.viewModeText,
            { color: viewMode === 'list' ? 'white' : theme.secondaryText }
          ]}>List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'calendar' && { backgroundColor: theme.primary }]}
          onPress={() => setViewMode('calendar')}
        >
          <AntDesign
            name="calendar"
            size={20}
            color={viewMode === 'calendar' ? 'white' : theme.secondaryText}
          />
          <Text style={[
            styles.viewModeText,
            { color: viewMode === 'calendar' ? 'white' : theme.secondaryText }
          ]}>Календарь</Text>
        </TouchableOpacity>
      </View>

      {/* Табы категорий */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && [styles.activeTab, { borderBottomColor: theme.primary }]]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            { color: theme.secondaryText },
            activeTab === 'all' && { color: theme.primary, fontWeight: 'bold' }
          ]}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'university' && [styles.activeTab, { borderBottomColor: theme.primary }]]}
          onPress={() => setActiveTab('university')}
        >
          <Text style={[
            styles.tabText,
            { color: theme.secondaryText },
            activeTab === 'university' && { color: theme.primary, fontWeight: 'bold' }
          ]}>Университет</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && [styles.activeTab, { borderBottomColor: theme.primary }]]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[
            styles.tabText,
            { color: theme.secondaryText },
            activeTab === 'personal' && { color: theme.primary, fontWeight: 'bold' }
          ]}>Личные</Text>
        </TouchableOpacity>
      </View>

      {/* Список событий */}
      {viewMode === 'list' ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AntDesign name="calendar" size={64} color={theme.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                {loading ? 'Загрузка событий...' : 'Нет событий'}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.calendarContainer}>
          <Text style={[styles.calendarPlaceholder, { color: theme.secondaryText }]}>
            Календарь событий будет добавлен в следующем обновлении
          </Text>
        </View>
      )}


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewModeContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  viewModeText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    color: '#666',
  },
  listContent: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  eventDescription: {
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  leaveButton: {
    backgroundColor: '#FF6B6B',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  leaveButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reviewButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
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
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  calendarPlaceholder: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },


});

export default EventsScreen; 