import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
    USER_PROFILE: '@asulink_user_profile',
    AUTH_TOKEN: '@asulink_auth_token',
    POSTS: '@asulink_posts',
    THEME: '@asulink_theme',
    THEME_PREFERENCE: '@asulink_theme_preference'
};

export const saveData = async (key: string, data: any): Promise<boolean> => {
    try {
        // Проверяем, что данные не undefined или null
        if (data === undefined || data === null) {
            console.warn(`⚠️ Attempting to save undefined/null data for key: ${key}`);
            return false;
        }

        // Для React Native используем AsyncStorage
        await AsyncStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Data saved for key: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error saving data for key ${key}:`, error);
        return false;
    }
};

export const loadData = async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
        // Для React Native используем AsyncStorage
        const jsonValue = await AsyncStorage.getItem(key);

        if (jsonValue) {
            const parsedValue = JSON.parse(jsonValue);
            console.log(`✅ Data loaded for key: ${key}`);
            return parsedValue;
        }

        console.log(`ℹ️ No data found for key: ${key}, using default value`);
        return defaultValue;
    } catch (error) {
        console.error(`❌ Error loading data for key ${key}:`, error);
        return defaultValue;
    }
};

export const removeData = async (key: string): Promise<boolean> => {
    try {
        // Для React Native используем AsyncStorage
        await AsyncStorage.removeItem(key);
        console.log(`✅ Data removed for key: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error removing data for key ${key}:`, error);
        return false;
    }
};