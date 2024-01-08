import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
      <Text style={styles.mevie}>
        <Text style={styles.me}>ME</Text>
        <Text style={styles.vie}>vie</Text>
      </Text>
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
     <TouchableOpacity
      onPress={registerUser}
      style={styles.button}>
      <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Daftar</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "#130B2B",
  },
  me: {
    fontSize: 40,
    color: "#FE53BB",
  },
  vie: {
    fontSize: 34,
    color: "white",
  },
  mevie: {
    top: 120,
    left: 145,
    width: 135,
    height: 60,
    textAlign: "left",
    fontWeight: "700",
    position: "absolute",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "#FE53BB"
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    backgroundColor: "white",
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#FE53BB',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Register;
