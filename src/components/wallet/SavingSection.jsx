import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles'; // Menggunakan style asli Anda

// Komponen kartu tabungan
const SavingCard = ({ item, onSelect }) => {
  const progress = item.target > 0 ? (item.current / item.target) * 100 : 0;
  const clampedProgress = Math.min(100, progress);

  return (
    <TouchableOpacity
      style={styles.savingCardDetail}
      onPress={() => onSelect(item)}
    >
      <LinearGradient
        colors={[item.bgColor || '#6DD5FA', item.bgColor || '#6DD5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.savingCard}
      >
        <Text style={styles.savingCardTitle}>{item.name}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.savingCardProgressText}>{Math.floor(clampedProgress)}%</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${clampedProgress}%` }]} />
          </View>
        </View>
        <Text style={styles.savingCardTarget}>
          Target: <Text style={styles.savingCardTargetAmount}>Rp {item.target.toLocaleString('id-ID')}</Text>
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Komponen utama section tabungan
const SavingsSection = ({ savings, onAddSaving, navigation, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (savings && savings.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % savings.length);
    }
  };

  const handlePrev = () => {
    if (savings && savings.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + savings.length) % savings.length);
    }
  };

  const hasSavings = savings && savings.length > 0;

  return (
    <View style={[styles.card, styles.savingsContainer]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tabungan</Text>
        <TouchableOpacity
          onPress={onAddSaving}
          style={styles.addSavingButton}
        >
          <Ionicons
            name="add"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {hasSavings ? (
        <View style={styles.savingsCarousel}>
          <TouchableOpacity
            style={styles.carouselArrow}
            onPress={handlePrev}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>

          <SavingCard
            item={savings[currentIndex]}
            onSelect={onSelect ? onSelect : () => {}}
          />

          <TouchableOpacity
            style={styles.carouselArrow}
            onPress={handleNext}
          >
            <Ionicons
              name="chevron-forward"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={localStyles.emptyContainer}>
          <Text style={localStyles.emptyText}>Belum ada target tabungan.</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => navigation.navigate('SavingsScreen')}
      >
        <Text style={styles.viewAllText}>Lihat Semua Tabungan</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  emptyContainer: {
    height: 120,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  savingCardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  savingCardProgressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarBackground: {
    width: 120,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  savingCardTarget: {
    color: '#e0e0e0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  savingCardTargetAmount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default React.memo(SavingsSection);
