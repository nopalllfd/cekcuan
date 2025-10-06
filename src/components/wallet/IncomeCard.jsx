import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const IncomeCard = ({ income }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <LinearGradient
      colors={['#1B2F6D', '#9AC2FF', '#1B2F6D']}
      locations={[0, 0.47, 0.91]}
      start={{ x: 0.1, y: 0.2 }}
      end={{ x: 0.9, y: 0.8 }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Jumlah Pemasukan</Text>
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Feather
            name={isVisible ? 'eye' : 'eye-off'}
            size={22}
            color="rgba(255, 255, 255, 0.8)"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.amountText}>{isVisible ? `Rp ${income.toLocaleString('id-ID')}` : 'Rp ••••••••'}</Text>
      <View style={styles.incomeCardBottomRow}>
        <TouchableOpacity style={styles.historyLink}>
          <Text style={styles.historyText}>Lihat History</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="rgba(255, 255, 255, 0.8)"
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default React.memo(IncomeCard);
