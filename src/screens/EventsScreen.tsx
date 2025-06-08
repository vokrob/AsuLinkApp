import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'university' | 'personal';
}

const EventsScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'university' | 'personal'>('all');
  const [showAddEvent, setShowAddEvent] = useState(false);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'День открытых дверей',
      date: '20.05.2023',
      time: '10:00',
      location: 'Корпус C, Актовый зал',
      description: 'Ежегодное мероприятие для абитуриентов и их родителей.',
      category: 'university'
    },
    {
      id: '2',
      title: 'Встреча со студентами',
      date: '15.05.2023',
      time: '15:30',
      location: 'Корпус D, Аудитория 404',
      description: 'Обсуждение вопросов по учебной программе.',
      category: 'university'
    },
    {
      id: '3',
      title: 'Консультация по дипломной работе',
      date: '25.05.2023',
      time: '14:00',
      location: 'Корпус M, Кафедра ИТ',
      description: 'Индивидуальная консультация с научным руководителем.',
      category: 'personal'
    },
  ]);

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    return event.category === activeTab;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title="События" onMenuPress={() => { }} />

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

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.eventCard, {
            backgroundColor: theme.card,
            shadowColor: theme.text
          }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: theme.text }]}>{item.title}</Text>
              <View style={[
                styles.categoryBadge,
                {
                  backgroundColor: item.category === 'university'
                    ? (isDarkTheme ? '#1A3A5A' : '#E6F2FF')
                    : (isDarkTheme ? '#5A1A1A' : '#FFE6E6')
                }
              ]}>
                <Text style={[
                  styles.categoryText,
                  {
                    color: item.category === 'university'
                      ? (isDarkTheme ? '#81B4FF' : '#0066CC')
                      : (isDarkTheme ? '#FF8181' : '#CC0000')
                  }
                ]}>
                  {item.category === 'university' ? 'Университет' : 'Личное'}
                </Text>
              </View>
            </View>
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <AntDesign name="calendar" size={16} color={theme.secondaryText} />
                <Text style={[styles.detailText, { color: theme.secondaryText }]}>{item.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <AntDesign name="clockcircleo" size={16} color={theme.secondaryText} />
                <Text style={[styles.detailText, { color: theme.secondaryText }]}>{item.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <AntDesign name="enviromento" size={16} color={theme.secondaryText} />
                <Text style={[styles.detailText, { color: theme.secondaryText }]}>{item.location}</Text>
              </View>
            </View>
            <Text style={[styles.eventDescription, { color: theme.text }]}>{item.description}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => setShowAddEvent(true)}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderRadius: 8,
    padding: 15,
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
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
  },
  eventDescription: {
    color: '#333',
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2874A6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default EventsScreen; 