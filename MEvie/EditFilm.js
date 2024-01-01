import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';

const EditFilm = ({ route, navigation }) => {
  const { id } = route.params;
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));

  const [currentName, setCurrentName] = useState('');
  const [currentTahun, setCurrentTahun] = useState('');
  const [currentDesc, setCurrentDesc] = useState('');

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
          }
        },
        (_, error) => console.log(error)
      );
    });
  }, [db, id]);

  const updateName = () => {
    // Update data film ke database
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE names SET name = ?, tahun = ?, desc = ? WHERE id = ?',
        [currentName, currentTahun, currentDesc, id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log('Film berhasil diupdate');
            navigation.goBack(); // Kembali ke halaman sebelumnya setelah update
          } else {
            console.log('Gagal update film');
          }
        },
        (_, error) => console.log(error)
      );
    });
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
        placeholder='Tahun'
      />
      <TextInput
        style={styles.input}
        value={currentDesc}
        onChangeText={text => setCurrentDesc(text)}
        placeholder='Deskripsi'
      />
      <Button title='Update' onPress={updateName} />
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
