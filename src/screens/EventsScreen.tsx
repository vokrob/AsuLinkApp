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
  const { theme } = useTheme();
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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={activeTab === 'all' ? styles.activeTabText : styles.tabText}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'university' && styles.activeTab]}
          onPress={() => setActiveTab('university')}
        >
          <Text style={activeTab === 'university' ? styles.activeTabText : styles.tabText}>Университет</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={activeTab === 'personal' ? styles.activeTabText : styles.tabText}>Личные</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: item.category === 'university' ? '#E6F2FF' : '#FFE6E6' }
              ]}>
                <Text style={[
                  styles.categoryText,
                  { color: item.category === 'university' ? '#0066CC' : '#CC0000' }
                ]}>
                  {item.category === 'university' ? 'Университет' : 'Личное'}
                </Text>
              </View>
            </View>
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <AntDesign name="calendar" size={16} color="#666" />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <AntDesign name="clockcircleo" size={16} color="#666" />
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <AntDesign name="enviromento" size={16} color="#666" />
                <Text style={styles.detailText}>{item.location}</Text>
              </View>
            </View>
            <Text style={styles.eventDescription}>{item.description}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddEvent(true)}>
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
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2874A6',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#2874A6',
    fontWeight: 'bold',
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