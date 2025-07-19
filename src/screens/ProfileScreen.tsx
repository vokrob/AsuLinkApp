import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import HeaderBar from '../components/Navigation/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';
import { useMenu } from '../contexts/MenuContext';
import * as ImagePicker from 'expo-image-picker';
import { saveData, loadData, removeData, KEYS } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const avatarImage = require('../../assets/Avatar.jpg');

interface UserProfile {
  id: string;
  name: string;
  avatar: any;
  // Student fields
  faculty?: string;
  group?: string;
  course?: string;
  // Professor fields
  department?: string;
  position?: string;
  // Common fields
  email: string;
  role: 'student' | 'professor' | 'admin';
}

const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  name: 'Danil Borkov',
  avatar: avatarImage,
  faculty: 'Institute of Mathematics and Information Technology',
  group: '4.305-2',
  email: 'borkov.43052@asu.edu.ru',
  role: 'student'
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { theme, isDarkTheme } = useTheme();
  const { toggleRightMenu, rightMenuVisible } = useMenu();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editValue, setEditValue] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const existingProfile = await loadData<UserProfile | null>(KEYS.USER_PROFILE, null);

        if (existingProfile) {
          // Убеждаемся, что у профиля есть аватар
          const profileWithAvatar = {
            ...existingProfile,
            avatar: existingProfile.avatar || require('../../assets/Avatar.jpg')
          };
          setProfile(profileWithAvatar);
          console.log('Existing profile loaded:', profileWithAvatar);
        } else {
          // Если профиля нет, используем дефолтный
          setProfile(DEFAULT_PROFILE);
          console.log('Profile initialized with default data');
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        setProfile(DEFAULT_PROFILE);
      }
    };

    initializeProfile();
  }, []);

  useEffect(() => {
    const persistProfile = async () => {
      // Сохраняем профиль только если он не пустой
      if (profile.id) {
        await saveData(KEYS.USER_PROFILE, profile);
        console.log('Profile saved:', profile);
      }
    };

    persistProfile();
  }, [profile]);



  const handleAvatarChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Необходим доступ к галерее!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfile(prev => ({
          ...prev,
          avatar: { uri: result.assets[0].uri }
        }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Произошла ошибка при выборе изображения');
    }
  };

  const handleEditField = (field: keyof UserProfile) => {
    setEditField(field);
    setEditValue(profile[field] as string);
    setEditModalVisible(true);
  };

  const saveFieldEdit = () => {
    if (editField) {
      setProfile(prev => ({
        ...prev,
        [editField]: editValue
      }));
    }
    setEditModalVisible(false);
    setEditField(null);
  };

  const getFieldIcon = (field: string) => {
    const iconColor = theme.secondaryText;

    switch (field) {
      case 'email': return <MaterialIcons name="email" size={24} color={iconColor} />;
      case 'faculty': return <MaterialIcons name="school" size={24} color={iconColor} />;
      case 'group': return <MaterialIcons name="group" size={24} color={iconColor} />;
      case 'course': return <MaterialIcons name="grade" size={24} color={iconColor} />;
      case 'department': return <MaterialIcons name="business" size={24} color={iconColor} />;
      case 'position': return <MaterialIcons name="work" size={24} color={iconColor} />;
      default: return <MaterialIcons name="info" size={24} color={iconColor} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom', 'left', 'right']}>
      <HeaderBar
        title="Profile"
        onMenuPress={toggleRightMenu}
        showMenuButton={true}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        scrollEnabled={!rightMenuVisible}
        pointerEvents={rightMenuVisible ? 'none' : 'auto'}
      >
        <View style={[styles.profileHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarChange}
          >
            <Image
              source={profile.avatar}
              style={styles.avatar}
              defaultSource={{ uri: 'https://via.placeholder.com/100x100' }}
            />
          </TouchableOpacity>

          <Text style={[styles.userName, { color: theme.text }]}>{profile.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: isDarkTheme ? '#1A3A5A' : '#E6F2FF' }]}>
            <Text style={[styles.roleText, { color: isDarkTheme ? '#81B4FF' : '#0066CC' }]}>
              {profile.role === 'student'
                ? 'Студент'
                : profile.role === 'professor'
                  ? 'Преподаватель'
                  : 'Администратор'}
            </Text>
          </View>
        </View>

        <View style={[styles.infoSection, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Информация</Text>

          {/* Поля для студентов */}
          {profile.role === 'student' && (
            <>
              {['faculty', 'group', 'course', 'email'].filter(field =>
                field === 'email' || profile[field as keyof UserProfile]
              ).map((field) => (
                <TouchableOpacity
                  key={field}
                  style={styles.infoRow}
                  onPress={() => handleEditField(field as keyof UserProfile)}
                >
                  {getFieldIcon(field)}
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
                      {field === 'faculty' ? 'Факультет' :
                        field === 'group' ? 'Группа' :
                          field === 'course' ? 'Курс' :
                            field === 'email' ? 'Email' : ''}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {profile[field as keyof UserProfile]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Поля для преподавателей */}
          {profile.role === 'professor' && (
            <>
              {['department', 'position', 'email'].filter(field =>
                field === 'email' || profile[field as keyof UserProfile]
              ).map((field) => (
                <TouchableOpacity
                  key={field}
                  style={styles.infoRow}
                  onPress={() => handleEditField(field as keyof UserProfile)}
                >
                  {getFieldIcon(field)}
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
                      {field === 'department' ? 'Кафедра' :
                        field === 'position' ? 'Должность' :
                          field === 'email' ? 'Email' : ''}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {profile[field as keyof UserProfile]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Поля для администраторов (показываем все) */}
          {profile.role === 'admin' && (
            <>
              {['faculty', 'group', 'course', 'department', 'position', 'email'].filter(field =>
                field === 'email' || profile[field as keyof UserProfile]
              ).map((field) => (
                <TouchableOpacity
                  key={field}
                  style={styles.infoRow}
                  onPress={() => handleEditField(field as keyof UserProfile)}
                >
                  {getFieldIcon(field)}
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
                      {field === 'faculty' ? 'Факультет' :
                        field === 'group' ? 'Группа' :
                          field === 'course' ? 'Курс' :
                            field === 'department' ? 'Кафедра' :
                              field === 'position' ? 'Должность' :
                                field === 'email' ? 'Email' : ''}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {profile[field as keyof UserProfile]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>


      </ScrollView>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {
            backgroundColor: theme.background,
            shadowColor: isDarkTheme ? '#000' : '#666'
          }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editField === 'faculty' ? 'Факультет' :
                  editField === 'group' ? 'Группа' :
                    editField === 'course' ? 'Курс' :
                      editField === 'department' ? 'Кафедра' :
                        editField === 'position' ? 'Должность' :
                          editField === 'email' ? 'Email' : 'Редактирование'}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <AntDesign name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.modalInput, {
                borderColor: theme.border,
                backgroundColor: isDarkTheme ? theme.card : '#f9f9f9',
                color: theme.text
              }]}
              value={editValue}
              onChangeText={setEditValue}
              multiline={false}
              numberOfLines={1}
              autoCapitalize="none"
              placeholderTextColor={theme.placeholderText}
              keyboardType={editField === 'email' ? 'email-address' : 'default'}
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={saveFieldEdit}
            >
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarHint: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2874A6',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15,
  },
  roleText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  editFieldButton: {
    padding: 5,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    color: '#666',
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    minHeight: 50,
  },
  saveButton: {
    backgroundColor: '#2874A6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen; 
