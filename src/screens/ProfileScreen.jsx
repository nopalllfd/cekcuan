import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// Pastikan path ini benar
import { deleteAllCategories } from '../services/database';
const ProfileScreen = ({ fetchData }) => {
  const handleDeleteAllCategories = async () => {
    try {
      // Panggil fungsi dari file database.js untuk menghapus data
      await deleteAllCategories();
      console.log('Semua kategori berhasil dihapus!');

      await fetchData();

      Alert.alert('Berhasil!', 'Semua kategori telah dihapus.');
    } catch (error) {
      console.error('Gagal menghapus semua kategori:', error);
      Alert.alert('Error', 'Gagal menghapus data.');
    }
  };

  const showDeleteAllConfirmation = () => {
    Alert.alert(
      'Hapus Semua Kategori',
      'Apakah Anda yakin ingin menghapus semua kategori? Tindakan ini tidak dapat dibatalkan.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: handleDeleteAllCategories,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman Profile</Text>
      <Text style={styles.subText}>Fitur akan segera hadir!</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={showDeleteAllConfirmation}
      >
        <Text style={styles.deleteButtonText}>HAPUS SEMUA KATEGORI</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
  },
  subText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
