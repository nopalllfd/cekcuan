import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AddTransactionButton = ({ onPress }) => {
  return (
    <LinearGradient
      colors={['#F8810BB2', '#531DA2', '#4A2AE9', '#2E065A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.addTransactionButtonWrapper}
    >
      <TouchableOpacity
        style={styles.addTransactionButton}
        onPress={onPress}
      >
        <Text style={styles.addTransactionText}>Masukkan Pengeluaran...</Text>
        <MaterialIcons
          name="edit"
          size={24}
          color="#a5a3a3ff"
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  addTransactionButtonWrapper: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 30,
    padding: 2,
  },
  addTransactionButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#2a2a40',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addTransactionText: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.7,
  },
});

export default AddTransactionButton;
