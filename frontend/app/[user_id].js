import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Image, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-elements";
import { getItem, deleteItem } from "../util/Storage";
import * as Notifications from 'expo-notifications';
import { setItem } from "expo-secure-store";
import { api } from "../util/Api";

const Home = () => {
  const { user_id } = useLocalSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  const handleAskPhoto = async () => {
    try {
      const response = await api.post("/images", {
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
      const response = await api.delete(`/images/${userData.id}`);
    } catch (error) {
      console.error("Error al eliminar la URL de la imagen", error);
    }
  }

  const handleSharePhoto = async () => {
    try {
      const response = await api.post(`/images/${userData.id}/share`);
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
      const response = await api.post("/logout", {
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
        
        const response = await api.get(`/users/${user_id}`);
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
      const { imageUrl, username }  = data;

      if (username === userData.username) {
        setItem("imageUrl", imageUrl);
        setImageUrl(imageUrl);
      }
      
    });
  
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      if (data?.imageUrl) {
        Linking.openURL(data.imageUrl);
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