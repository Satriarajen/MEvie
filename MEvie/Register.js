import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const Register = ({ navigation }) => {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = () => {
    // Validasi input
    if (!username || !name || !email || !password) {
      Alert.alert('Error', 'Silakan lengkapi semua kolom.');
      return;
    }

    // Lakukan pendaftaran pengguna ke dalam database
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)',
        [username, name, email, password],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            Alert.alert('Sukses', 'Pendaftaran berhasil!');
            navigation.navigate('Login'); // Redirect ke halaman login setelah pendaftaran sukses
          } else {
            Alert.alert('Error', 'Pendaftaran gagal. Silakan coba lagi.');
          }
        },
        (txObj, error) => {
          console.error(error);
          Alert.alert('Error', 'Terjadi kesalahan dalam pendaftaran.');
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrasi</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Daftar" onPress={registerUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
  },
});

export default Register;
