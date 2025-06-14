import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

import FeedScreen from '../screens/FeedScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import EventsScreen from '../screens/EventsScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CodeVerificationScreen from '../screens/CodeVerificationScreen';
import EmailConfirmationScreen from '../screens/EmailConfirmationScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import RightSideMenu from '../components/Menu/RightSideMenu';
import { useTheme } from '../contexts/ThemeContext';
import { MenuProvider, useMenu } from '../contexts/MenuContext';
import { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Settings: undefined;
  CodeVerification: {
    email: string;
    username: string;
    next_step?: string;
  };
  EmailConfirmation: {
    email: string;
    username?: string;
  };
  ProfileSetup: {
    email: string;
    username: string;
    token?: string;
  };
  EventDetail: {
    eventId: string;
  };
  RoomDetail: {
    roomId: string;
  };
};

export type MainTabParamList = {
  Feed: undefined;
  Messages: undefined;
  Events: undefined;
  Map: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigatorContent = () => {
  const { theme, isDarkTheme, toggleTheme } = useTheme();
  const { rightMenuVisible, setRightMenuVisible, toggleRightMenu } = useMenu();
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    setRightMenuVisible(false);
    navigation.navigate('Settings' as never);
  };

  const handleSupportPress = () => {
    setRightMenuVisible(false);
    Alert.alert('Поддержка', 'Функция в разработке');
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.secondaryText,
        }}
      >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Новости',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarLabel: 'События',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Сообщения',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message1" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Карта',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>

    {/* Боковое меню поверх всего интерфейса */}
    {rightMenuVisible && (
      <RightSideMenu
        visible={rightMenuVisible}
        onClose={toggleRightMenu}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
        onSettingsPress={handleSettingsPress}
        onSupportPress={handleSupportPress}
        isProfileScreen={false}
      />
    )}
  </View>
  );
};

const MainTabNavigator = () => {
  return (
    <MenuProvider>
      <MainTabNavigatorContent />
    </MenuProvider>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="CodeVerification" component={CodeVerificationScreen} />
        <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;