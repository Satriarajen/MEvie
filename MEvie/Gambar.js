import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

const Gambar = () => {
  const [names, setNames] = useState([]);
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    // Membuat tabel jika belum ada
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Images (id INTEGER PRIMARY KEY AUTOINCREMENT, imagePath TEXT);'
      );
    });
  }, []);

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

  const saveToDatabase = async () => {
    try {
      const newPath = `${FileSystem.documentDirectory}images/${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: imagePath, to: newPath });
      
      db.transaction(tx => {
        tx.executeSql('INSERT INTO Images (imagePath) VALUES (?);', [newPath], (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Gambar berhasil disimpan di database');
          } else {
            console.log('Gagal menyimpan gambar di database');
          }
        });
      });
    } catch (error) {
      console.error('Error saat menyimpan gambar:', error);
    }
  };

      // GET Nama
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Images', null,
          (txObj, resultSet) => setNames(resultSet.rows._array),
          (txObj, error) => console.log(error)
        );
      });

      // Delete Gambar
      const deleteName = (id) => {
        db.transaction(tx => {
          tx.executeSql('DELETE FROM Images WHERE id = ?', [id],
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

      // Menampilkan Database ke Layar
      const showNames = () => {
        return names.map((name, index) => {
          return (
            <View key={index}>
    
            <View>
              <Image key={name.id} source={{ uri: name.imagePath }} style={{ width: 200, height: 200 }} />
              <Text>{name.imagePath}</Text>
            </View>

            <View>
          <Button title='Delete' onPress={() => deleteName(name.id)} />
          <Button title='Update' onPress={() => updateName(name.id)} />
          </View>
    
            </View>
          );
        });
      };

  return (
    <View>
      <TouchableOpacity onPress={chooseImage}>
        <Text>Pilih Gambar</Text>
      </TouchableOpacity>
      {imagePath && <Image source={{ uri: imagePath }} style={{ width: 400, height: 300 }} />}
      <Button title="Simpan" onPress={saveToDatabase} />

      {showNames()}
    </View>
  );
};

export default Gambar;
