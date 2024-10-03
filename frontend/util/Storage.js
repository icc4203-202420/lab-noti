import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export const saveItem = async (key, value) => {
    if (isWeb) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error('Error saving data in AsyncStorage', e);
        }
    } else {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (e) {
            console.error('Error saving data in SecureStore', e);
        }
    }
};

export const getItem = async (key) => {
    if (isWeb) {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.error('Error fetching data from AsyncStorage', e);
        }
    } else {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (e) {
            console.error('Error fetching data from SecureStore', e);
        }
    }
    return null;
};

export const deleteItem = async (key) => {
    if (isWeb) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error deleting data from AsyncStorage', e);
        }
    } else {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (e) {
            console.error('Error deleting data from SecureStore', e);
        }
    }
};
