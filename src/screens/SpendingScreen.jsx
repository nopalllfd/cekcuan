import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getSpendingData } from '../services/database'; // Assume this function exists

const SpendingScreen = () => {
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSpendingData();
      setChartData(data.chartData);
      setTransactions(data.transactions);
      setTotalSpending(data.totalSpending);
    };

    fetchData();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#1a1a2e',
    backgroundGradientTo: '#1a1a2e',
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spending Overview</Text>
        <Text style={styles.totalText}>Total: ${totalSpending.toFixed(2)}</Text>
      </View>

      {/* Pie Chart Section */}
      <View style={styles.chartContainer}>
        {chartData.length > 0 && (
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </View>

      {/* Transaction List Section */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((item) => (
          <View
            key={item.id}
            style={styles.transactionItem}
          >
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 5,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  listContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#332959',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#fff',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
});

export default SpendingScreen;
