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



// Notifications.addNotificationReceivedListener((notification) => {
//   const { data } = notification.request.content;
//   // console.log('Data from notification:', data);
//   const imageUrl = data.image_url;
//   // console.log('Image URL:', imageUrl);
//   saveItem('imageUrl', imageUrl);

//   // Puedes usar esta URL para actualizar el estado o hacer algo más con la imagen
// });


module.exports = {
    getNotificationToken
}