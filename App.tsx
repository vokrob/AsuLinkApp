import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import StatusBarComponent from './src/components/StatusBarComponent';
import { testConnection, setAuthToken } from './src/services/api';
import { loadData, KEYS } from './src/utils/storage';

export default function App() {
  // Automatic connection test and token loading on app startup
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing application...');

      // Load saved token
      try {
        const savedToken = await loadData(KEYS.AUTH_TOKEN, null);
        if (savedToken) {
          console.log('Loaded saved authentication token');
          setAuthToken(savedToken);
        } else {
          console.log('No saved token found');
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }

      // Test server connection
      console.log('Automatic server connection test...');
      try {
        const isConnected = await testConnection();
        if (isConnected) {
          console.log('Server connection established!');
        } else {
          console.log('Failed to connect to server');
          console.log('Check that Django server is running');
        }
      } catch (error) {
        console.error('Error testing connection:', error);
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