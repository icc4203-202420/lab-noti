import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Image, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-elements";
import axios from "axios";
import { getItem, deleteItem } from "../util/Storage";
import * as Notifications from 'expo-notifications';
import { setItem } from "expo-secure-store";

const Home = () => {
  const { user_id } = useLocalSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  const handleAskPhoto = async () => {
    try {
      const response = await axios.post("http://192.168.1.32:3000/images", {
        user_id: userData.id
      });
    } catch (error) {
      console.error("Error al pedir la foto de la cerveza");
    }
  };
  
  const handleDeletePhoto = async () => {
    try {
      await deleteItem("imageUrl");
      setImageUrl(null);
      const response = await axios.delete(`http://192.168.1.32:3000/images/${userData.id}`);
    } catch (error) {
      console.error("Error al eliminar la URL de la imagen", error);
    }
  }

  const handleSharePhoto = async () => {
    console.log("Compartiendo la foto de la cerveza");
    try {
      const response = await axios.post(`http://192.168.1.32:3000/images/${userData.id}/share`);
    } catch (error) {
      console.error("Error al compartir la URL de la imagen", error);
    }
  }
    
  const loadImageUrl = async () => {
    try {
      const url = await getItem("imageUrl");
      setImageUrl(url);
    } catch (error) {
      console.error("Error al obtener la URL de la imagen", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await deleteItem("userId"); 
      await deleteItem("imageUrl");
      const response = await axios.post("http://192.168.1.32:3000/logout", {
        id: userData.id,
      });      
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }

  useEffect(() => {
    const initData = async () => {
      try {
        
        const response = await axios.get(`http://192.168.1.32:3000/users/${user_id}`);
        setUserData(response.data); 
      } catch (error) {
        if (error.response) {
          await deleteItem("userId");
          router.push("/");
          setErrorMessage("Error al obtener los datos del usuario");
        } else {
          setErrorMessage("Error de conexión");
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
    loadImageUrl();
  }, [user_id, imageUrl]);

  useEffect(() => {
    const receivedListener = Notifications.addNotificationReceivedListener(async (notification) => {
      const { title, body , data } = notification.request.content;
      const imageUrl = data.imageUrl;

      console.log(notification.request.content)

      if (title?.includes("Imagen generada para")) {
          setItem("imageUrl", imageUrl);
          setImageUrl(imageUrl);
      } else {  
        console.log("Notificación recibida: ");
        console.log("   title: ", title);
        console.log("   body: ", body);
      }
      
    });
  
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      if (data?.image_url) {
        Linking.openURL(data.image_url);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []); 
  


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.title}>Bienvenido, {userData.username}</Text>
          <Button title={imageUrl ? "Pedir otra foto" : "Pedir foto"} onPress={handleAskPhoto} style={styles.button}/>

          {imageUrl ? (
            <>
              <Button type="outline" title="Compartir foto" onPress={handleSharePhoto} style={styles.button}/>
              <Button type="outline" title="Eliminar foto" onPress={handleDeletePhoto} style={styles.button}/>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </>
          ) : (
            <>
              {/* <Text>No se encontró la URL de la imagen</Text> */}
            </>
          )}
        </>
      ) : (
        <Text>No se encontró información del usuario</Text>
      )}

      <View style={styles.logoutContainer}>
        <Button title="Salir" onPress={handleLogOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    alignSelf: "center",
    resizeMode: "contain",
  },
  logoutContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  }
});

export default Home;