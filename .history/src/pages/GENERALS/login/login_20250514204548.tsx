import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BackgroundLogin from './components/backgroundLogin';
import Icon from 'react-native-vector-icons/Feather';

export default function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/auth/login', {
        username,
        password,
      });

      if (response.data === 'Login successful') {
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundLogin />
      <View style={{ position: 'absolute', top: 100, left: 20, right: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' }}>
          Iniciar Sesión
        </Text>

        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
          style={{
            backgroundColor: 'white',
            marginBottom: 10,
            padding: 10,
            borderRadius: 5,
          }}
        />

        <View style={{ position: 'relative', marginBottom: 10 }}>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5,
              paddingRight: 40, // espacio para el ícono
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 10, top: 12 }}
          >
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Crear cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
