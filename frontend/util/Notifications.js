import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
// import { getItem, saveItem } from './Storage';

async function getNotificationToken() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
    const projectId = Constants.expoConfig.extra.eas.projectId || 'tu-project-id';

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
}


async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const projectId = Constants.expoConfig.extra.eas.projectId || 'tu-project-id';
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
 

  return token;
}


module.exports = {
    getNotificationToken,
    registerForPushNotificationsAsync
}