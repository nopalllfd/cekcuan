import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Terima 'funds' sebagai prop, bukan 'income'
const IncomeCard = ({ funds, navigation }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <LinearGradient
      colors={['#1B2F6D', '#9AC2FF', '#1B2F6D']}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        {/* Judul diubah agar lebih jelas */}
        <Text style={styles.cardTitle}>Dana Tersedia (Belum Dialokasikan)</Text>
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Feather
            name={isVisible ? 'eye' : 'eye-off'}
            size={22}
            color="rgba(255, 255, 255, 0.8)"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.amountText}>{isVisible ? `Rp ${(funds || 0).toLocaleString('id-ID')}` : 'Rp ••••••••'}</Text>
      <View style={styles.incomeCardBottomRow}>
        <View />
        <TouchableOpacity
          style={styles.historyLink}
          onPress={() => navigation.navigate('Riwayat')}
        >
          <Text style={styles.historyText}>Lihat Riwayat</Text>
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

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 20, marginBottom: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 },
  amountText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  incomeCardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  historyLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  historyText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: '500' },
});

export default React.memo(IncomeCard);
