import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { styles } from './styles';

// --- PERUBAHAN 1 ---
// Tambahkan fungsi untuk memformat angka dengan titik ribuan
const formatNumber = (value) => {
  if (!value) return '';
  // Hapus semua karakter selain angka
  const cleanValue = value.toString().replace(/[^0-9]/g, '');
  // Tambahkan titik sebagai pemisah ribuan
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const TransactionInputStep = ({ categories, selectedCategoryId, description, onDescriptionChange, amount, onAmountChange, onSave }) => {
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  if (!selectedCategory) {
    return null;
  }

  // --- PERUBAHAN 2 ---
  // Buat handler untuk membersihkan input sebelum dikirim ke state induk
  const handleAmountChange = (text) => {
    const cleanText = text.replace(/\./g, ''); // Hapus semua titik
    onAmountChange(cleanText); // Panggil fungsi dari props dengan nilai bersih
  };

  return (
    <View style={styles.modalBody}>
      {/* Bagian menampilkan kategori (tidak berubah) */}
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

      {/* Input Nama (tidak berubah) */}
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

      {/* --- PERUBAHAN 3 --- */}
      {/* Input Harga (diperbarui dengan format) */}
      <Text style={styles.label}>Harga</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g., 50.000" // Placeholder diubah agar lebih jelas
          placeholderTextColor="#a8a8a8ff"
          value={formatNumber(amount)} // Tampilkan nilai yang SUDAH DIFORMAT
          onChangeText={handleAmountChange} // Panggil handler baru saat diketik
        />
        <Text style={styles.inputCurrency}>Rp</Text>
      </View>

      {/* Tombol Simpan (tidak berubah) */}
      <CustomButton
        title="SIMPAN"
        onPress={onSave}
        style={styles.saveButton}
      />
    </View>
  );
};

export default TransactionInputStep;
