import React, { createContext, useState, useContext, ReactNode } from 'react';

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

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
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