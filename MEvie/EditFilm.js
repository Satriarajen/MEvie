import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const EditFilm = ({ route, navigation }) => {
  const { id } = route.params;
  const { user_id } = route.params;
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));

  const [currentName, setCurrentName] = useState('');
  const [currentTahun, setCurrentTahun] = useState('');
  const [currentDesc, setCurrentDesc] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    // Ambil data film berdasarkan ID dari database
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM names WHERE id = ?', [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const film = result.rows.item(0);
            setCurrentName(film.name);
            setCurrentTahun(film.tahun);
            setCurrentDesc(film.desc);
            setCurrentImage(film.imagePath);
            setImagePath(film.imagePath);
          }
        },
        (_, error) => console.log(error)
      );
    });
  }, [db, id]);

// Fungsi untuk memilih gambar
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

    
  // Fungsi untuk mengupdate film
  const updateFilm = async () => {
    try {
      const newPath = `${FileSystem.documentDirectory}images/${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: imagePath, to: newPath });

      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE names SET name = ?, tahun = ?, desc = ?, imagePath = ?, WHERE id = ?',
          [currentName, currentTahun, currentDesc, newPath, id],
          (_, result) => {
            // Navigasi kembali ke layar Home setelah update
            navigation.navigate('Home', { user_id: user_id });
          },
          (_, error) => console.log(error)
        );
      });
    } catch (error) {
      console.error('Error updating film', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Film</Text>
      <TextInput
        style={styles.input}
        value={currentName}
        onChangeText={text => setCurrentName(text)}
        placeholder='Judul'
      />
      <TextInput
        style={styles.input}
        value={currentTahun}
        onChangeText={text => setCurrentTahun(text)}
        placeholder='Link'
      />
      <TextInput
        style={styles.input}
        value={currentDesc}
        onChangeText={text => setCurrentDesc(text)}
        placeholder='Deskripsi'
      />
      <Button title="Pilih Gambar" onPress={chooseImage} />
      {imagePath && <Image source={{ uri: imagePath }} style={{ width: 200, height: 200 }} />}
      <Button title='Update' onPress={updateFilm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
  },
});

export default EditFilm;
