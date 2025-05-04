import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderBarProps {
  title: string;
  onMenuPress?: () => void;
  showMenuButton?: boolean;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  notificationCount?: number;
  profileAvatar?: any;
  onProfilePress?: () => void;
  onAddPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onMenuPress,
  showMenuButton = false,
  showNotification = false,
  onNotificationPress,
  notificationCount = 0,
  profileAvatar,
  onProfilePress,
  onAddPress,
  showBackButton = false,
  onBackPress
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showBackButton && onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {profileAvatar && (
          <TouchableOpacity onPress={onProfilePress}>
            <Image
              source={profileAvatar}
              style={styles.avatar}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>
        {onAddPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAddPress}
          >
            <Ionicons name="add-circle" size={26} color="#fff" />
          </TouchableOpacity>
        )}
        {showNotification && (
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications" size={24} color="#fff" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {showMenuButton && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2874A6',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
  backButton: {
    padding: 5,
    marginRight: 5,
  },
  notificationButton: {
    padding: 5,
    marginRight: 5,
    position: 'relative',
  },
  actionButton: {
    padding: 5,
    marginRight: 5,
  },
  headerLeft: {
    minWidth: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default HeaderBar;