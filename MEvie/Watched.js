import React from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

const Watched = ({route, navigation }) => {
  const [db, setDb] = useState(SQLite.openDatabase("example.db"));
  const { user_id } = route.params;

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
    const filteredNames = names.filter((name) => name.user_id === user_id && name.status === 'watched');
  
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
            <Text>status: {name.status}</Text>
          </View>
  
          <View style={styles.kolom}>
            <Button title="Delete" onPress={() => deleteName(name.id)} />
            <Button title="Belum ditonton" onPress={() => Unwatched(name.id)} />
            <Button
              title="Update"
              onPress={() => navigation.navigate("EditFilm", { id: name.id, user_id: user_id })}
            />
          </View>
        </View>
      );
    });
  };

  const Unwatched = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE names SET status = "unwatched" WHERE id = ?',
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter((name) => name.id !== id);
            setNames(existingNames);
          } else {
            console.log('Gagal mengubah status');
          }
        },
        (txObj, error) => console.log(error)
      );
    });
    
  };

  return (
    <View style={styles.container}>
      <ScrollView>{showNames()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    // backgroundColor: "lightgray",
    padding: 10,
    alignItems: "center",
  },
});

export default Watched;
