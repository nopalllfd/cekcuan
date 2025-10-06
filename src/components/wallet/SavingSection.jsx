import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const SavingGoalCard = () => (
  <LinearGradient
    colors={['#6DD5FA', '#2980B9']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.savingCard}
  >
    <Text style={styles.savingCardTitle}>Beli Sepatu</Text>
    <Text style={styles.savingCardProgressText}>80%</Text>
    <TouchableOpacity style={styles.savingCardDetail}>
      <Text style={styles.savingCardDetailText}>Lihat Detail</Text>
      <Ionicons
        name="arrow-forward"
        size={14}
        color="rgba(255,255,255,0.8)"
      />
    </TouchableOpacity>
  </LinearGradient>
);

const SavingsSection = () => (
  <View style={[styles.card, styles.solidCardBackground, styles.savingsContainer]}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Tabungan</Text>
      <TouchableOpacity style={styles.addSavingButton}>
        <Ionicons
          name="add"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
    <View style={styles.savingsCarousel}>
      <TouchableOpacity style={styles.carouselArrow}>
        <Ionicons
          name="chevron-back"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
      <SavingGoalCard />
      <TouchableOpacity style={styles.carouselArrow}>
        <Ionicons
          name="chevron-forward"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.viewAllButton}>
      <Text style={styles.viewAllText}>Lihat Semua Tabungan</Text>
      <Ionicons
        name="arrow-forward"
        size={20}
        color="#fff"
      />
    </TouchableOpacity>
  </View>
);

export default React.memo(SavingsSection);
