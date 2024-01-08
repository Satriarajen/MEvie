import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const About = ({route, navigation: { goBack }}) => {

  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);

  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);
  const [tahun, setTahun] = useState([]);
  const [currentTahun, setCurrentTahun] = useState(undefined);
  const [desc, setDesc] = useState([]);
  const [currentDesc, setCurrentDesc] = useState(undefined);
  const [image, setImage] = useState([]);
  const [currentImage, setCurrentImage] = useState(undefined);

  const [imagePath, setImagePath] = useState(null);

    useEffect(() => {
    //Membuat Tabel baru 
    db.transaction(tx => {
      try{
        tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, tahun NUMBER, desc TEXT, imagePath TEXT)', (tx,results) =>{
          if (results.rowsAffected > 0) {
            console.log('Kolom berhasil ditambahkan');
          } else {
            console.log('Gagal menambahkan kolom');
          }
        })
        console.log("Berhasil Membuat Tabel")
      } catch (error) {
        console.log("Gagal Membuat Tabel")
      }
    });


    // Mengisi variabel setNames dengan mengambil data dari database
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    setIsLoading(false);
  }, [db]);

  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading names...</Text>
      </View>
    );
  }


  // Input gambar START
  const chooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Izin akses galeri ditolak!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagePath(result.assets[0].uri);
    }
  };
  // Input gambar END

// Tambah Film
  const addName = async () => {
    try{

      const newPath = `${FileSystem.documentDirectory}images/${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: imagePath, to: newPath });


      db.transaction(tx => {
        tx.executeSql('INSERT INTO names (name, tahun, desc, imagePath) values (?, ?, ?, ?)',[currentName,currentTahun,currentDesc, newPath],
          (txObj, resultSet) => {
            let existingNames = [...names];
            existingNames.push({id:resultSet.insertId, name:currentName, tahun:currentTahun, desc: currentDesc, imagePath: newPath});
            setNames(existingNames);
            setCurrentName(undefined);
            setCurrentTahun(undefined);
            setCurrentDesc(undefined);
            setCurrentImage(undefined);
  
          },
          (txObj, error) => console.log(error),
          Alert.alert('Sukses', 'Data berhasil dikirim!')
        );
      });
    } catch(error)
    {
      console.error('Error Menambahkan Data', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengirim data.');
    }
  }
  
  // Tampilan Pada Layar
  return (
    <View style={styles.container2}>

    <Text>Tambah Film</Text>

      <TextInput style={styles.input2} value={currentName} placeholder='Judul' onChangeText={setCurrentName} />
      <TextInput style={styles.input2} value={currentTahun} placeholder='Tahun' onChangeText={setCurrentTahun} />
      <TextInput style={styles.input2} value={currentDesc} placeholder='Desc' onChangeText={setCurrentDesc} />
      
      
      <Button title="Pilih Gambar" onPress={chooseImage}/>
      {imagePath && <Image source={{ uri: imagePath }} style={{ width: 200, height: 200 }} />}


      <Button title="Tambah" onPress={addName} />
      

      <StatusBar style="auto" />
    </View>
  );
};

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
    container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input2: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
  },
});

export default About;