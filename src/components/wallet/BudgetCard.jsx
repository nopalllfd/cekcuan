import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

const BudgetCard = ({ budget, onUpdate }) => (
  <View style={[styles.card, styles.solidCardBackground]}>
    <Text style={styles.cardTitle}>Jatah Bulanan</Text>
    <Text style={styles.amountText}>Rp {budget.toLocaleString('id-ID')}</Text>
    <View style={styles.budgetCardActions}>
      <TouchableOpacity style={styles.updateButton}>
        <MaterialCommunityIcons
          name="history"
          size={20}
          color="rgba(255, 255, 255, 0.8)"
        />
        <Text style={styles.historyText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={onUpdate}
      >
        <Text style={styles.historyText}>Update</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(255, 255, 255, 0.8)"
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default React.memo(BudgetCard);
