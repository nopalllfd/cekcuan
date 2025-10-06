import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const AddIncomeModal = ({ isVisible, onClose, onSave, navigation }) => {
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Input Tidak Valid', 'Silakan masukkan jumlah pemasukan yang benar.');
      return;
    }
    onSave(Number(amount));
    setAmount('');
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Pemasukan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={26}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalLabel}>Jumlah Pemasukan Bulanan</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., 5000000"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus={true}
          />
          <View style={styles.historyButton}>
            <TouchableOpacity
              style={styles.historyLink}
              onPress={() => navigation.navigate('Riwayat')}
            >
              <Text style={styles.historyText}>Lihat History ›</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={handleSave}
          >
            <Text style={styles.modalSaveButtonText}>Simpan Pemasukan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default React.memo(AddIncomeModal);
