import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

const Login = ({ navigation }) => {
  const [db, setDb] = useState(SQLite.openDatabase("example.db"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  
  useEffect(() => {
    
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, name TEXT, email TEXT, password TEXT)",
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log('Tabel "users" berhasil dibuat');
          } else {
            console.log('Gagal membuat tabel "users"');
          }
        },
        (txObj, error) => console.log(error)
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, tahun TEXT, desc TEXT, imagePath TEXT, status TEXT DEFAULT "unwatched", user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id))',
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Tabel "names" berhasil dibuat');
          } else {
            console.log('Gagal membuat tabel "names"');
          }
        }
      );
    });
  }, [db]);

  const loginUser = () => {
    // Validasi input
    if (!username || !password) {
      Alert.alert("Error", "Silakan masukkan username dan password.");
      return;
    }

    // Cek kecocokan username dan password di database
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            Alert.alert("Sukses", "Login berhasil!");
            navigation.navigate("Home", { user_id: resultSet.rows.item(0).id });
          } else {
            Alert.alert("Error", "Username atau password salah.");
          }
        },
        (txObj, error) => {
          console.error(error);
          Alert.alert("Error", "Terjadi kesalahan dalam login.");
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
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={loginUser}
        style={styles.button}>
        <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>
        Belum punya akun?{" "}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("Register")}
        >
          Daftar di sini
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    top: 165,
    left: 145,
    width: 135,
    height: 60,
    textAlign: "left",
    fontWeight: "700",
    position: "absolute",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FE53BB"
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    
  },
  signupText: {
    marginTop: 16,
    color: "white",
  },
  signupLink: {
    color: "#FE53BB",
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
    fontWeight: "Bold",
  },
});

export default Login;
