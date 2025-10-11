import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ChartScreen from '../screens/ChartScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WalletScreen from '../screens/WalletScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for screens that need a header (e.g., Notifications)
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerTitle: 'Notifikasi',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator for the main screens
const MainTabs = ({ fetchData }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'rgba(133, 149, 198, 1)',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#010923',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 5,
          height: 60,
          borderRadius: 10,
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          height: 70,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: -5,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        sceneContainerStyle: {
          backgroundColor: '#1a1a2e',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
        initialParams={{ fetchData }} // Pass fetchData to HomeScreen
      />
      <Tab.Screen
        name="Riwayat"
        component={HistoryScreen}
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="history"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chart"
        component={ChartScreen} // This is the correct way
        options={{
          title: 'Chart',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="credit-card" // Using a more appropriate icon for a spending tab
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account"
              color={color}
              size={size}
            />
          ),
        }}
      >
        {(props) => (
          <WalletScreen
            {...props}
            fetchData={fetchData}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigator;
