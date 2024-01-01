import React from 'react';
import {Text, View, StyleSheet, Button, Image} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from 'react-native-gesture-handler';

const Home = ({navigation}) => {

  // Konek Database
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));

  // Attribut
  const [names, setNames] = useState([]);


    // GET Nama
      db.transaction(tx => {
      tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

   // Hapus ID
   const deleteName = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM names WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter(name => name.id !== id);
            setNames(existingNames);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  // Menampilkan Nama
  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>

          <View style={styles.kolom1}>
          <Image key={name.id} source={{ uri: name.imagePath }} style={{ width: 200, height: 200 }} />
          <Text>Judul:  {name.name}</Text>
          <Text>Tahun:  {name.tahun}</Text>
          <Text>Deskripsi:  {name.desc}</Text>
          </View>
          
          <View style={styles.kolom}>
          <Button title='Delete' onPress={() => deleteName(name.id)} />
          <Button title='Update' onPress={() => navigation.navigate('EditFilm', { id: name.id })} />
          </View>

        </View>
      );
    });
  };

  return (
    // Menampilkan Pada Layar
    <ScrollView>
    <Button title="Tambah Film" onPress={()=>navigation.navigate('Tambah Film')} />
    <Button title="gambar" onPress={()=>navigation.navigate('gambar')} />
    
    {showNames()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  },
    kolom1: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8,
    width : '70%'
  },
  kolom: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    margin: 8,
    width: '30%',
  },
});

export default Home;