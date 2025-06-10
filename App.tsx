import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import StatusBarComponent from './src/components/StatusBarComponent';
import { testConnection } from './src/services/api';

export default function App() {
  // Автоматический тест соединения при запуске приложения
  useEffect(() => {
    const initializeConnection = async () => {
      console.log('🚀 Инициализация приложения...');
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

    initializeConnection();
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