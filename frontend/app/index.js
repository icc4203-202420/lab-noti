import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { useRouter } from "expo-router";
import axios from "axios";
import { registerForPushNotificationsAsync } from "../util/Notifications";
import { saveItem, getItem } from "../util/Storage";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [pushToken, setPushToken] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    try {

      const response = await axios.post("http://192.168.1.32:3000/login", 
        { 
          email: email.toLocaleLowerCase(),
          password,
          push_token: pushToken,
        }
      );

      setUser(response.data.user);
      console.log(response.data);

      await saveItem("userId", `${response.data.user.id}`);

      router.push(`/${response.data.user.id}`);
    } catch (error) {

      if (error.response) {
        // const { data } = error.response;
        setErrorMessage("Credenciales incorrectas");
      } else {
        setErrorMessage("Error de conexión");
      }
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
  
    };
    getToken();

    const checkIsLogged = async () => {
      const userId = await getItem("userId");
        if (userId) {
          router.push(`/${userId}`);
        }
    }
    checkIsLogged();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => {setEmail(text); setErrorMessage("")}}
        leftIcon={{ type: "font-awesome", name: "envelope" }}
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={(text) => {setPassword(text); setErrorMessage("")}}
        secureTextEntry
        leftIcon={{ type: "font-awesome", name: "lock" }}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        buttonStyle={styles.button}
      />
      <Button
        type="outline"
        title="Crear cuenta"
        onPress={() => router.push('/register')}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  }
});

export default Login;
