import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';  // Usamos el Text de react-native
import { Input, Button } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { getNotificationToken } from '../util/Notifications';  // Importamos la función getNotificationToken
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pushToken, setPushToken] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);

    const pToken = await getNotificationToken();  // Obtenemos el token de notificación
    setPushToken(pToken);  // Actualizamos el estado de pushToken con el token de notificación

    
    try {
      const response = await fetch('http://192.168.1.32:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username,
            email,
            password,
            push_token: pushToken,
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso');
        router.push('/'); // Navegar a la pantalla de login después del registro exitoso
      } else {
        alert("Ya existe un usuario con esas credenciales");
        // alert(data.errors.join('\n'));
      }
    } catch (error) {
      alert('Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Input
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Registrarse"
        onPress={handleRegister}
        loading={loading}
        buttonStyle={styles.button}
      />
      <Button
        type="outline"
        title="Ya tengo una cuenta"
        onPress={() => router.push('/')}
        loading={loading}
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
    fontSize: 24,  // Ajuste de tamaño de fuente
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20
  }
});

export default Register;
