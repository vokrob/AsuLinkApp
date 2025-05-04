import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface BottomTabBarProps {
  activeTab: 'Feed' | 'Messages' | 'Profile';
  onNavigate: (screen: string) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onNavigate }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'Feed' && styles.navItemActive]}
        onPress={() => onNavigate('Feed')}
      >
        <AntDesign name="home" size={24} color={activeTab === 'Feed' ? "#2874A6" : "#555"} />
        <Text style={activeTab === 'Feed' ? styles.navTextActive : styles.navText}>Новости</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'Messages' && styles.navItemActive]}
        onPress={() => onNavigate('Messages')}
      >
        <AntDesign name="message1" size={24} color={activeTab === 'Messages' ? "#2874A6" : "#555"} />
        <Text style={activeTab === 'Messages' ? styles.navTextActive : styles.navText}>Сообщения</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'Profile' && styles.navItemActive]}
        onPress={() => onNavigate('Profile')}
      >
        <AntDesign name="user" size={24} color={activeTab === 'Profile' ? "#2874A6" : "#555"} />
        <Text style={activeTab === 'Profile' ? styles.navTextActive : styles.navText}>Профиль</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2874A6',
  },
  navText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 12,
    color: '#2874A6',
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default BottomTabBar; 