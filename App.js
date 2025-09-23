import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { initDB, getCategories, getTransactions, getCurrentBalance } from './src/services/database';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      await getCategories();
      await getTransactions();
      await getCurrentBalance();
      console.log('App data successfully refreshed.');
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await initDB();
        await fetchData();
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

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <AppProvider fetchData={fetchData}>
          <AppNavigator />
        </AppProvider>
      </NavigationContainer>
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
