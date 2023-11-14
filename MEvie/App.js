import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useState, useEffect} from 'react';



export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const[names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);

  // USE EFFECT
  useEffect(() => {

    // Jika Table Kosong
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE  IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT')
    });

    // Memilih dari Table
    db.transaction(tx => {
      tx.executeSql ( 'SELECT * FROM names', null,
      (txObj, resultSet) => setNames(resultSet.rows._array),
      (txObj, error) => console.log(error) 
      );
    });

    setIsLoading(false);
  }, [db]);


  if(isLoading){
    return (
      <View style={styles.container}>
      <Text>Loading...</Text>
      </View>
    );
  }

  // Tambah Nama
  const addName = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO names (name) values (?)', [currentName],
        (txObj, resultSet) => {
          let existingNames = [...names];
          existingNames.push({ id: resultSet.insertId, name: currentName});
          setNames(existingNames);
          setCurrentName(undefined);
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  // Show Nama
  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{name.name}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput value={currentName} placeholder='Masukkan Nama' onChangeText={setCurrentName}/>
      <Button title='Tambah nama' onPress={addName}/>
      {showNames()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'stretch',
    justifyContent: 'space-between',
    margin: 8,
  }
});
