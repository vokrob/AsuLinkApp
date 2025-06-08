import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { saveData, loadData, KEYS } from '../utils/storage';

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  theme: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  secondaryText: string;
  placeholderText: string;
}

const lightTheme: ThemeColors = {
  primary: '#2874A6',
  background: '#FFFFFF',
  card: '#F9F9F9',
  text: '#000000',
  border: '#CCCCCC',
  notification: '#FF3B30',
  secondaryText: '#555555',
  placeholderText: '#888888',
};

const darkTheme: ThemeColors = {
  primary: '#3498DB',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#444444',
  notification: '#FF453A',
  secondaryText: '#AAAAAA',
  placeholderText: '#777777',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await loadData<boolean | null>(KEYS.THEME_PREFERENCE, null);
        if (savedTheme !== null) {
          setIsDarkTheme(savedTheme);
        } else {
          if (systemColorScheme) {
            setIsDarkTheme(systemColorScheme === 'dark');
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const newValue = !prev;
      saveData(KEYS.THEME_PREFERENCE, newValue).catch(error => {
        console.error('Error saving theme preference:', error);
      });
      return newValue;
    });
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext; 