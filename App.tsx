import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import StatusBarComponent from './src/components/StatusBarComponent';
import { testConnection, setAuthToken } from './src/services/api';
import { loadData, KEYS } from './src/utils/storage';

export default function App() {
  // Автоматический тест соединения и загрузка токена при запуске приложения
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Инициализация приложения...');

      // Загружаем сохраненный токен
      try {
        const savedToken = await loadData(KEYS.AUTH_TOKEN, null);
        if (savedToken) {
          console.log('🔑 Загружен сохраненный токен аутентификации');
          setAuthToken(savedToken);
        } else {
          console.log('ℹ️ Сохраненный токен не найден');
        }
      } catch (error) {
        console.error('❌ Ошибка при загрузке токена:', error);
      }

      // Тестируем соединение с сервером
      console.log('🔍 Автоматический тест соединения с сервером...');
      try {
        const isConnected = await testConnection();
        if (isConnected) {
          console.log('✅ Соединение с сервером установлено!');
        } else {
          console.log('❌ Не удалось подключиться к серверу');
          console.log('🔧 Проверьте, что Django сервер запущен');
        }
      } catch (error) {
        console.error('❌ Ошибка при тестировании соединения:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBarComponent />
      <SafeAreaProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#2874A6',
    },
  }
);