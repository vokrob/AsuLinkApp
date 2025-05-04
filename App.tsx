import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import StatusBarComponent from './src/components/StatusBarComponent';

export default function App() {
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