import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import FeedScreen from 'screens/FeedScreen';
import LoginScreen from 'screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Feed" component={FeedScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;