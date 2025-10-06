import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { styles } from './styles';

const iconOptions = ['silverware-fork-knife', 'shopping-outline', 'home-outline', 'car-sports', 'account-cash-outline', 'medical-bag', 'book-open-variant', 'food-outline', 'coffee-outline', 'cellphone', 'plane-train'];

const AddCategoryStep = ({ newCategoryName, onCategoryNameChange, selectedIcon, onIconSelect, onSave }) => (
  <View style={styles.modalBody}>
    <Text style={styles.label}>Nama Kategori</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Belanja Bulanan"
        placeholderTextColor="#888"
        value={newCategoryName}
        onChangeText={onCategoryNameChange}
      />
      <MaterialCommunityIcons
        name="pencil"
        size={20}
        color="#888"
        style={styles.inputIcon}
      />
    </View>
    <Text style={styles.label}>Pilih Icon</Text>
    <View style={styles.iconGridContainer}>
      {iconOptions.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.iconGridButton}
          onPress={() => onIconSelect(item)}
        >
          <View style={[styles.categoryIconContainer, selectedIcon === item && styles.categoryIconContainerActive]}>
            <MaterialCommunityIcons
              name={item}
              size={24}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
    <CustomButton
      title="SIMPAN KATEGORI"
      onPress={onSave}
      style={styles.saveButton}
    />
  </View>
);

export default AddCategoryStep;
