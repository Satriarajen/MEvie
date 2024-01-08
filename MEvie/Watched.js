import React from "react";
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
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
            <Text style={{ color: '#FE53BB',  fontWeight: 'bold', fontSize: 25, marginBottom: 15,  textAlign: 'center' }}> {name.name}</Text>
            <Image
              key={name.id}
              source={{ uri: name.imagePath }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 15, 
                overflow: 'hidden',
                marginBottom: 15
              }}/>
            <Text style={{ color: 'white', marginBottom: 10, textAlign: 'center'  }}> {name.desc}</Text>
            {/* <Text style={{ color: 'white', marginBottom: 10, textAlign: 'center' }}> {name.status}</Text> */}
            <Text style={{ color: 'white', marginBottom: 10, textAlign: 'center' }}> {name.tahun}</Text>
          </View>

          <View style={styles.kolom}>
            <TouchableOpacity
              onPress={() => deleteName(name.id)}
              style={styles.buttonCancel}>
               <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Unwatched(name.id)}
              style={styles.button}>
               <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Belum ditonton</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditFilm", { id: name.id, user_id: user_id })}
              style={styles.button}>
               <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Update</Text>
            </TouchableOpacity>
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
    backgroundColor: "#130B2B",
  },
  row: {
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
    width: "100%",
    
  },
  kolom: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
    width: "30%",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "lightgray",
    padding: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: '#FE53BB',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  buttonCancel: {
    borderColor : '#FE53BB',
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },  
  buttonText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default Watched;
