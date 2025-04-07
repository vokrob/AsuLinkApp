import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import FeedScreen from 'screens/FeedScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Feed">
                <Stack.Screen name="Feed" component={FeedScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;