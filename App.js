import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { initDB, getCategories, getTransactions, getCurrentBalance } from './src/services/database'; // Import your data functions
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  // This is the function you need to pass down
  const fetchData = useCallback(async () => {
    try {
      await getCategories();
      await getTransactions();
      await getCurrentBalance();
      // Add more data fetching logic here if needed
      console.log('App data successfully refreshed.');
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await initDB();
        await fetchData(); // Call fetchData on initial app load
        await Font.loadAsync({
          'Shoika-Regular': require('./src/assets/fonts/Shoika-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [fetchData]);

  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading app resources...</Text>
      </View>
    );
  }

  // Pass fetchData to the AppNavigator component
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator fetchData={fetchData} />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
