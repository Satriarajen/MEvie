import React from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

const Home = ({route, navigation }) => {
  const [db, setDb] = useState(SQLite.openDatabase("example.db"));
  const { user_id } = route.params;
  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, name TEXT, email TEXT, password TEXT)',
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

    db.transaction(tx => {
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
  const [names, setNames] = useState([]);

  // GET Nama
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM names",
      null,
      (txObj, resultSet) => setNames(resultSet.rows._array),
      (txObj, error) => console.log(error)
    );
  });

  // Hapus ID
  const deleteName = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM names WHERE id = ?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter((name) => name.id !== id);
            setNames(existingNames);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  // Menampilkan Nama
  const showNames = () => {
    const filteredNames = names.filter((name) => name.user_id === user_id);
  
    return filteredNames.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <View style={styles.kolom1}>
            <Text>Judul: {name.name}</Text>
            <Image
              key={name.id}
              source={{ uri: name.imagePath }}
              style={{ width: 200, height: 200 }}
            />
            <Text>Link: {name.tahun}</Text>
            <Text>Deskripsi: {name.desc}</Text>
          </View>
  
          <View style={styles.kolom}>
            <Button title="Delete" onPress={() => deleteName(name.id)} />
            <Button
              title="Update"
              onPress={() => navigation.navigate("EditFilm", { id: name.id })}
            />
          </View>
        </View>
      );
    });
  };
  

  return (
    // Menampilkan Pada Layar
    <ScrollView>
      <Button
        title="Tambah Film"
        onPress={() => navigation.navigate("Tambah Film", {user_id: user_id})}
      />

      {showNames()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
  },
  kolom1: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
    width: "70%",
  },
  kolom: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-around",
    margin: 8,
    width: "30%",
  },
});

export default Home;
