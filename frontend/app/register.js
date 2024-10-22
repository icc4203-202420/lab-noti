import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRouter } from 'expo-router';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    console.log('Registrando usuario');
    try {
      const response = await axios.post('http://10.33.1.236:3000/register', {
        user: {
          username,
          email,
          password
        },
      });

      router.push('/'); 
    } catch (error) {

      Alert.alert(
        'Usuario ya existente',
        'Por favor, intente con otras credenciales.', 
        [{ text: 'OK' }] 
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (text) => {
    const maxLength = 20;
    const filteredText = text.replace(/[^a-zA-Z0-9_.]/g, '');
  
    if (filteredText !== text) {
      Alert.alert(
        'Entrada no válida',
        `Solo se permiten letras, números, guiones bajos y puntos en el nombre de usuario.\n\nMax cantidad caracteres: ${maxLength}`,
        [{ text: 'Aceptar' }]
      );
    }

    setUsername(filteredText.slice(0, maxLength));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Input
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={handleUsernameChange}
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20
  }
});

export default Register;
