import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { useRouter } from "expo-router";
import { registerForPushNotificationsAsync } from "../util/Notifications";
import { saveItem, getItem } from "../util/Storage";
import { api } from "../util/Api";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    setErrorMessage("");
    try {

      const pushToken = await registerForPushNotificationsAsync();
      const response = await api.post("/login", 
        { 
          email: email.toLocaleLowerCase(),
          password,
          push_token: pushToken,
        }
      );

      const user = response.data.user;

      setUser(user);
      await saveItem("userId", `${user.id}`);

      router.push(`/${response.data.user.id}`);
      //      push(/1)
    } catch (error) {

      if (error.response) {
        setErrorMessage("Credenciales incorrectas");
      } else {
        setErrorMessage("Error de conexión");
      }
    }
  };

  useEffect(() => {
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
        buttonStyle={styles.button}Iniciar
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
