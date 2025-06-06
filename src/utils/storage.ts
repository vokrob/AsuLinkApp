export const KEYS = {
    USER_PROFILE: '@asulink_user_profile',
    POSTS: '@asulink_posts',
    THEME: '@asulink_theme',
    THEME_PREFERENCE: '@asulink_theme_preference'
};

export const saveData = async (key: string, data: any): Promise<boolean> => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(data));
        } else {
            try {
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                await AsyncStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                try {
                    const SecureStore = require('expo-secure-store');
                    await SecureStore.setItemAsync(key, JSON.stringify(data));
                } catch (e) {
                    console.error('No storage method available:', e);
                    return false;
                }
            }
        }
        return true;
    } catch (error) {
        console.error(`Error saving data for key ${key}:`, error);
        return false;
    }
};

export const loadData = async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
        let jsonValue: string | null = null;

        if (typeof window !== 'undefined' && window.localStorage) {
            jsonValue = window.localStorage.getItem(key);
        } else {
            try {
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                jsonValue = await AsyncStorage.getItem(key);
            } catch (e) {
                try {
                    const SecureStore = require('expo-secure-store');
                    jsonValue = await SecureStore.getItemAsync(key);
                } catch (e) {
                    console.error('No storage method available:', e);
                    return defaultValue;
                }
            }
        }

        return jsonValue ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
        console.error(`Error loading data for key ${key}:`, error);
        return defaultValue;
    }
};

export const removeData = async (key: string): Promise<boolean> => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
        } else {
            try {
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                await AsyncStorage.removeItem(key);
            } catch (e) {
                try {
                    const SecureStore = require('expo-secure-store');
                    await SecureStore.deleteItemAsync(key);
                } catch (e) {
                    console.error('No storage method available:', e);
                    return false;
                }
            }
        }
        return true;
    } catch (error) {
        console.error(`Error removing data for key ${key}:`, error);
        return false;
    }
};