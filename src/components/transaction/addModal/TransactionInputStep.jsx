import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { styles } from './styles';

// Tambahkan props: categories dan selectedCategoryId
const TransactionInputStep = ({ categories, selectedCategoryId, description, onDescriptionChange, amount, onAmountChange, onSave }) => {
  // Cari objek kategori yang lengkap berdasarkan ID yang dipilih
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  // Jika karena suatu hal kategori tidak ditemukan, jangan render apa-apa
  if (!selectedCategory) {
    return null;
  }

  return (
    <View style={styles.modalBody}>
      {/* --- BAGIAN BARU UNTUK MENAMPILKAN KATEGORI --- */}
      <View style={styles.selectedCategoryContainer}>
        <View style={styles.categoryIconContainer}>
          <MaterialCommunityIcons
            name={selectedCategory.icon}
            size={28}
            color="#fff"
          />
        </View>
        <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
      </View>
      {/* ------------------------------------------- */}

      <Text style={styles.label}>Nama</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Nama..."
          placeholderTextColor="#a8a8a8ff"
          value={description}
          onChangeText={onDescriptionChange}
        />
        <MaterialCommunityIcons
          name="pencil"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
      </View>
      <Text style={styles.label}>Harga</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Masukkan Harga..."
          placeholderTextColor="#a8a8a8ff"
          value={amount}
          onChangeText={onAmountChange}
        />
        <Text style={styles.inputCurrency}>Rp</Text>
      </View>
      <CustomButton
        title="SIMPAN"
        onPress={onSave}
        style={styles.saveButton}
      />
    </View>
  );
};

export default TransactionInputStep;
