import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { styles } from './styles';

const CategorySelectionStep = ({ categories, selectedCategoryId, onSelectCategory, onAddCategory, onNext }) => {
  if (!categories || !Array.isArray(categories)) {
    return (
      <View style={[styles.modalBody, styles.loadingContainer]}>
        <ActivityIndicator
          size="large"
          color="#fff"
        />
        <Text style={styles.modalTitle}>Memuat Kategori...</Text>
        <Text style={styles.modalSubText}>Pastikan Anda terhubung ke internet.</Text>
      </View>
    );
  }

  const expenseCategories = categories.filter((cat) => !['Pemasukan', 'Pengeluaran', 'Tabungan'].includes(cat.name));

  return (
    <View style={styles.modalBody}>
      <View style={styles.categoryGridContainer}>
        {expenseCategories.map((item) => (
          <TouchableOpacity
            key={item.id.toString()}
            style={styles.categoryGridButton}
            onPress={() => onSelectCategory(item.id)}
          >
            <View style={[styles.categoryIconContainer, selectedCategoryId === item.id && styles.categoryIconContainerActive]}>
              <MaterialCommunityIcons
                name={item.icon || 'help-circle-outline'}
                size={24}
                color="#fff"
              />
            </View>
            <Text style={styles.categoryGridText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key="add-category-button"
          style={styles.categoryGridButton}
          onPress={onAddCategory}
        >
          <View style={styles.addCategoryIconContainer}>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={24}
              color="#4E6691"
            />
          </View>
          <Text style={styles.categoryGridText}>Tambah Kategori</Text>
        </TouchableOpacity>
      </View>
      <CustomButton
        title="Next →"
        onPress={onNext}
        style={styles.nextButton}
        textStyle={styles.nextButtonText}
      />
    </View>
  );
};

export default CategorySelectionStep;
