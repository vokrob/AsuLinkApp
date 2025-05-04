import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

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
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
          toValue: screenWidth,
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
  }, [visible, slideAnim, backdropOpacity, screenWidth]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
          onTouchEnd={onClose}
        />
        <Animated.View
          style={[
            styles.rightMenu,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.rightMenuHeader}>
            <Text style={styles.rightMenuTitle}>Меню</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={onSupportPress}>
            <MaterialIcons name="support-agent" size={24} color="#333" />
            <Text style={styles.menuItemText}>Обращение в поддержку</Text>
          </TouchableOpacity>

          <View style={styles.bottomSection}>
            <View style={styles.settingsRow}>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={onSettingsPress}
              >
                <Ionicons name="settings-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Настройки</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.themeToggle}
                onPress={onToggleTheme}
              >
                {isDarkTheme ? (
                  <Ionicons name="sunny-outline" size={24} color="#333" />
                ) : (
                  <Ionicons name="moon-outline" size={24} color="#333" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  rightMenu: {
    position: 'absolute',
    width: '70%',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1000,
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
    borderBottomColor: '#eee',
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
    borderBottomColor: '#eee',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  bottomSection: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
    backgroundColor: '#f5f5f5',
  }
});

export default RightSideMenu;