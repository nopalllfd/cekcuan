import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AddTransactionButton = ({ onPress }) => {
  return (
    <LinearGradient
      colors={['#ebebebff', '#ebebebff', '#ebebebff', '#ebebebff']}
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
    borderRadius: 10,
    padding: 1,
  },
  addTransactionButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#040824F2',
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
