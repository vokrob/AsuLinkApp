import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, BackHandler } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface RightSideMenuProps {
  visible: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onSettingsPress: () => void;
  onSupportPress: () => void;
  isProfileScreen?: boolean;
}

const RightSideMenu: React.FC<RightSideMenuProps> = ({
  visible,
  onClose,
  isDarkTheme,
  onToggleTheme,
  onSettingsPress,
  onSupportPress,
  isProfileScreen = false
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuWidth = screenWidth * 0.7; // 70% of screen width

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Animation logic
  useEffect(() => {
    if (visible) {
      // Reset animation value if needed
      slideAnim.setValue(menuWidth);
      backdropOpacity.setValue(0);
      
      // Start animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: menuWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity, menuWidth]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.rightMenu,
          { 
            transform: [{ translateX: slideAnim }],
            width: menuWidth,
            backgroundColor: theme.background,
          }
        ]}
      >
        <View style={[styles.rightMenuHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.rightMenuTitle, { color: theme.text }]}>Меню</Text>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: theme.border }]} 
          onPress={onSupportPress}
        >
          <MaterialIcons name="support-agent" size={24} color={theme.text} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>Обращение в поддержку</Text>
        </TouchableOpacity>

        <View style={[styles.bottomSection, { borderTopColor: theme.border }]}>
          <View style={styles.settingsRow}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onSettingsPress}
            >
              <Ionicons name="settings-outline" size={24} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>Настройки</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.themeToggle, { backgroundColor: isDarkTheme ? theme.card : '#f5f5f5' }]}
              onPress={onToggleTheme}
            >
              {isDarkTheme ? (
                <Ionicons name="sunny-outline" size={24} color={theme.text} />
              ) : (
                <Ionicons name="moon-outline" size={24} color={theme.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backdropTouchable: {
    flex: 1,
  },
  rightMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  rightMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  rightMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  bottomSection: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeToggle: {
    padding: 10,
    borderRadius: 20,
  }
});

export default RightSideMenu;