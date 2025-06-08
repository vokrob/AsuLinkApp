import React from 'react';
import { StatusBar, View, Platform, StyleSheet, Dimensions } from 'react-native';

interface StatusBarComponentProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
}

const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 24;
};

const StatusBarComponent: React.FC<StatusBarComponentProps> = ({
  backgroundColor = '#2874A6',
  barStyle = 'light-content'
}) => {
  const statusBarHeight = getStatusBarHeight();

  return (
    <View style={[styles.statusBar, { height: statusBarHeight, backgroundColor }]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    width: '100%',
    zIndex: 999,
  }
});

export default StatusBarComponent; 