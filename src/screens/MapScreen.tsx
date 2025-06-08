import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';

interface Building {
  id: string;
  name: string;
  address: string;
  image: string;
  floors: number;
  description: string;
  rating: number;
}

interface Room {
  id: string;
  number: string;
  buildingId: string;
  floor: number;
  type: 'classroom' | 'laboratory' | 'lecture' | 'admin';
  capacity: number;
  equipment: string[];
  rating: number;
}

const MapScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const [activeView, setActiveView] = useState<'buildings' | 'rooms'>('buildings');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const buildings: Building[] = [
    {
      id: '1',
      name: 'Корпус Л',
      address: 'пр. Ленина, 61',
      image: 'https://www.asu.ru/files/images/editor/campus/corpusl10.jpg',
      floors: 4,
      description: 'Учебный корпус, в котором располагаются Институт биологии и биотехнологии, Институт математики и информационных технологий. Оснащен современными лабораториями и компьютерными классами для практических занятий студентов.',
      rating: 4.7
    },
    {
      id: '2',
      name: 'Корпус С',
      address: 'пр-т Социалистический, 68',
      image: 'https://www.asu.ru/files/images/editor/campus/Campusc11.jpg',
      floors: 3,
      description: 'Здесь находятся МИЭМИС (Международный институт экономики, менеджмента и информационных систем) и Юридический институт. Корпус оборудован учебными аудиториями и специализированными кабинетами для подготовки экономистов и юристов.',
      rating: 4.3
    },
    {
      id: '3',
      name: 'Корпус Д',
      address: 'ул. Димитрова, 66',
      image: 'https://www.asu.ru/files/images/editor/campus/corpusd15.jpg',
      floors: 5,
      description: 'В этом корпусе размещается Институт гуманитарных наук. Здесь проходят занятия студентов филологических, лингвистических и других гуманитарных направлений, расположена библиотека и лингафонные кабинеты.',
      rating: 4.0
    },
    {
      id: '4',
      name: 'Корпус М',
      address: 'пр-т Ленина, 61',
      image: 'https://www.asu.ru/files/images/editor/40/40-32.jpg',
      floors: 2,
      description: 'Корпус, в котором располагаются Институт географии и Институт истории и международных отношений. Оснащен картографическими лабораториями, историческими кабинетами и специализированными аудиториями.',
      rating: 3.8
    },
    {
      id: '5',
      name: 'Корпус К',
      address: 'пр-т Красноармейский, 90',
      image: 'https://www.asu.ru/files/images/editor/campus/corpusk01.jpg',
      floors: 4,
      description: 'Здесь находятся Институт цифровых технологий, электроники и физики, а также Институт химии и химико-фармацевтических технологий. Корпус оборудован современными лабораториями, исследовательскими центрами и экспериментальными площадками.',
      rating: 4.2
    }
  ];

  const rooms: Room[] = [
    {
      id: '101',
      number: '301',
      buildingId: '2',
      floor: 3,
      type: 'classroom',
      capacity: 30,
      equipment: ['Проектор', 'Компьютеры', 'Интерактивная доска'],
      rating: 4.8
    },
    {
      id: '102',
      number: '207',
      buildingId: '2',
      floor: 2,
      type: 'laboratory',
      capacity: 20,
      equipment: ['Компьютеры', 'Специальное оборудование'],
      rating: 4.5
    },
    {
      id: '103',
      number: '101',
      buildingId: '2',
      floor: 1,
      type: 'lecture',
      capacity: 100,
      equipment: ['Проектор', 'Аудиосистема'],
      rating: 4.2
    },
    {
      id: '104',
      number: '402',
      buildingId: '5',
      floor: 4,
      type: 'laboratory',
      capacity: 25,
      equipment: ['Компьютеры', 'VR-оборудование', '3D-принтеры'],
      rating: 4.9
    },
    {
      id: '105',
      number: '204',
      buildingId: '5',
      floor: 2,
      type: 'classroom',
      capacity: 40,
      equipment: ['Проектор', 'Интерактивная доска', 'Аудиосистема'],
      rating: 4.6
    },
    {
      id: '106',
      number: '214',
      buildingId: '1',
      floor: 2,
      type: 'lecture',
      capacity: 150,
      equipment: ['Проектор', 'Микрофон', 'Система видеоконференций'],
      rating: 4.7
    },
    {
      id: '107',
      number: '321',
      buildingId: '1',
      floor: 3,
      type: 'admin',
      capacity: 10,
      equipment: ['Компьютеры', 'Принтер', 'Сканер'],
      rating: 4.5
    },
    {
      id: '108',
      number: '401',
      buildingId: '3',
      floor: 4,
      type: 'classroom',
      capacity: 35,
      equipment: ['Юридическая библиотека', 'Компьютер', 'Проектор'],
      rating: 4.2
    },
    {
      id: '109',
      number: '203',
      buildingId: '3',
      floor: 2,
      type: 'lecture',
      capacity: 80,
      equipment: ['Имитация зала суда', 'Аудиосистема', 'Проектор'],
      rating: 4.6
    },
    {
      id: '110',
      number: '102',
      buildingId: '4',
      floor: 1,
      type: 'laboratory',
      capacity: 25,
      equipment: ['Лабораторное оборудование', 'Компьютеры', 'Интерактивная доска'],
      rating: 4.0
    },
    {
      id: '111',
      number: '210',
      buildingId: '4',
      floor: 2,
      type: 'classroom',
      capacity: 30,
      equipment: ['Математические модели', 'Проектор'],
      rating: 3.8
    }
  ];

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    setActiveView('rooms');
  };

  const filteredRooms = rooms.filter(room => {
    if (!selectedBuilding) return false;
    return room.buildingId === selectedBuilding.id;
  });

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
    <ScrollView style={[styles.contentContainer, { backgroundColor: theme.background }]}>
      {buildings.map(building => (
        <TouchableOpacity
          key={building.id}
          style={[styles.buildingCard, {
            backgroundColor: theme.card,
            shadowColor: theme.text
          }]}
          onPress={() => handleBuildingSelect(building)}
        >
          <Image
            source={{ uri: building.image }}
            style={styles.buildingImage}
          />
          <View style={styles.buildingInfo}>
            <Text style={[styles.buildingName, { color: theme.text }]}>{building.name}</Text>
            <View style={styles.addressRow}>
              <MaterialIcons name="location-on" size={16} color={theme.secondaryText} />
              <Text style={[styles.buildingAddress, { color: theme.secondaryText }]}>{building.address}</Text>
            </View>
            <Text style={[styles.buildingDescription, { color: theme.text }]} numberOfLines={2}>
              {building.description}
            </Text>
            {renderRatingStars(building.rating)}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderRoomsList = () => {
    const getRoomTypeColor = (type: string) => {
      switch (type) {
        case 'classroom': return { bg: isDarkTheme ? '#1A3A5A' : '#E6F2FF', text: isDarkTheme ? '#81B4FF' : '#0066CC' };
        case 'laboratory': return { bg: isDarkTheme ? '#3A1A5A' : '#F2E6FF', text: isDarkTheme ? '#C281FF' : '#6600CC' };
        case 'lecture': return { bg: isDarkTheme ? '#1A5A3A' : '#E6FFF2', text: isDarkTheme ? '#81FFC2' : '#00CC66' };
        case 'admin': return { bg: isDarkTheme ? '#5A3A1A' : '#FFF2E6', text: isDarkTheme ? '#FFC281' : '#CC6600' };
        default: return { bg: '#f0f0f0', text: '#333333' };
      }
    };

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
          data={filteredRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const typeColors = getRoomTypeColor(item.type);
            return (
              <View style={[styles.roomCard, {
                backgroundColor: theme.card,
                shadowColor: theme.text
              }]}>
                <View style={styles.roomHeader}>
                  <View>
                    <Text style={[styles.roomNumber, { color: theme.text }]}>
                      Аудитория {item.number}
                    </Text>
                    <Text style={[styles.floorInfo, { color: theme.secondaryText }]}>
                      Этаж: {item.floor}
                    </Text>
                  </View>
                  <View style={[styles.roomTypeBadge, { backgroundColor: typeColors.bg }]}>
                    <Text style={[styles.roomTypeText, { color: typeColors.text }]}>
                      {item.type === 'classroom' ? 'Аудитория' :
                        item.type === 'laboratory' ? 'Лаборатория' :
                          item.type === 'lecture' ? 'Лекционная' : 'Административная'}
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

                  <View style={styles.equipmentContainer}>
                    <Text style={[styles.equipmentTitle, { color: theme.text }]}>Оборудование:</Text>
                    <View style={styles.equipmentList}>
                      {item.equipment.map((eq, index) => (
                        <View key={index} style={[styles.equipmentItem, { backgroundColor: theme.primary + '20' }]}>
                          <Text style={[styles.equipmentText, { color: theme.text }]}>{eq}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {renderRatingStars(item.rating)}
              </View>
            );
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar title="Карта кампуса" onMenuPress={() => { }} />
      {activeView === 'buildings' ? renderBuildingsList() : renderRoomsList()}
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
  buildingCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
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
    padding: 10,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  buildingAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  buildingDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  roomsContainer: {
    flex: 1,
  },
  backToBuildings: {
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
    borderRadius: 8,
    padding: 15,
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
    alignItems: 'center',
    marginBottom: 10,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  floorInfo: {
    fontSize: 14,
    color: '#666',
  },
  roomTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roomTypeText: {
    fontSize: 12,
    color: '#0066CC',
  },
  roomDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  roomDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  roomDetailText: {
    marginLeft: 5,
    color: '#666',
  },
  equipmentContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  equipmentText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#333',
  },
});

export default MapScreen; 