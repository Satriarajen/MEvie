import React from "react";
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

const Home = ({ route, navigation }) => {
  const [db, setDb] = useState(SQLite.openDatabase("example.db"));
  const { user_id } = route.params;
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
    const filteredNames = names.filter(
      (name) => name.user_id === user_id && name.status === "unwatched"
    );

    return filteredNames.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <View style={styles.kolom1}>
            <Text style={styles.tittle}>{name.name}</Text>
            <Image
              key={name.id}
              source={{ uri: name.imagePath }}
              style={{ width: 200, height: 250,
                borderRadius: 100, 
                overflow: 'hidden',
                marginBottom: 15
 }}
            />
            <Text style={styles.desc}>{name.desc}</Text>
            <Text style={styles.link}>{name.tahun}</Text>
          </View>

          <View style={styles.kolom}>
            <TouchableOpacity
              onPress={() => deleteName(name.id)}
              style={styles.button}>
               <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Watched(name.id)}
              style={styles.button}>
               <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Sudah ditonton</Text>
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

  const Watched = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE names SET status = "watched" WHERE id = ?',
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter((name) => name.id !== id);
            setNames(existingNames);
          } else {
            console.log("Gagal mengubah status");
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  return (

    <View style={styles.container}>
      <View style={styles.mevie}><Text style={styles.me}>Me</Text> 
      <Text style={styles.vie}>Vie</Text></View>
      {/* <Image
        style={styles.accountCircleIcon}
        resizeMode="cover"
        source={require("./assets/account_circle.png")}
      /> */}
      <View style={styles.alternativeLayoutButtonContainer}>
         <View style={styles.wishlist}>
         <Button  title="Wishlist"
        color="#FE53BB"
        onPress={() => navigation.navigate("unwatched", { user_id: user_id })} />
          </View> 
          <Button  title="Has Been Watched"
        color="#130B2B"
        onPress={() => navigation.navigate("Sudah Ditonton", { user_id: user_id })} />
        </View>
      <ScrollView>{showNames()}</ScrollView>
      <View style={styles.navbar}>
      <Button
          title="Add Movie"
          color="#FE53BB"
          onPress={() =>
            navigation.navigate("Tambah Film", { user_id: user_id })
          }
        />
        {/* <Image
        style={styles.addIcon}
        resizeMode="cover"
        source={require("./assets/add.png")}
      /> */}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130B2B',
  },
  mevie: {
    margin: 20,
    flexDirection: 'row',
    //justifyContent: 'space-between',
  },
  me: {
    color: '#FE53BB',
    fontSize: 32,
    //fontFamily: 'Poppins',
    fontWeight: '700',
    //wordWrap: 'break-word',
  },
  vie: {
    color: 'white',
    fontSize: 32,
    //fontFamily: 'Poppins',
    fontWeight: '700',
    //wordWrap: 'break-word',
  },
  accountCircleIcon: {
    top: 30,
    left: 350,
    width: 30,
    height: 30,
    position: "absolute",
  },
  //addIcon: {
    //top: 689,
    //left: 272,
    //width: 40,
    //height: 40,
    //position: "absolute",
  //},
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
  },
  tittle: {
    color: '#FE53BB',  
    fontWeight: 'bold', 
    fontSize: 25, 
    marginBottom: 15,
  },
  desc: {
    color: 'white', 
    marginBottom: 10,
     textAlign: 'center',
  },
  link: {
    color: 'white', 
    marginBottom: 10,
    textAlign: 'center',
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
    //backgroundColor: "lightgray",
    padding: 40,
    alignItems: "flex-end",
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
  buttonText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default Home;
