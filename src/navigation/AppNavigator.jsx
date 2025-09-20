import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = ({ fetchData }) => {
  return (
    <NavigationContainer style={{ backgroundColor: '#1a1a2e' }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: '#8B5CF6', // Warna ungu untuk ikon aktif
          tabBarInactiveTintColor: '#fff', // Warna putih untuk ikon tidak aktif
          tabBarStyle: {
            backgroundColor: 'rgba(59, 58, 58, 0.9)',
            borderTopWidth: 0, // Hapus garis atas
            elevation: 0, // Hapus shadow di Android
            paddingBottom: 5,
            height: 60,
            borderRadius: 10,
            position: 'absolute',
            bottom: 0, // Menyesuaikan jarak dari bawah layar
            left: 20,
            right: 20,
            height: 70,
            paddingBottom: 20, // Tambahkan padding untuk menampung jarak dari bawah
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: -5,
          },
          tabBarItemStyle: {
            paddingTop: 5,
          },
          // Tambahkan ini untuk mengatur latar belakang setiap layar
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
          name="Profil"
          options={{
            title: 'Profil',
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
            <ProfileScreen
              {...props}
              fetchData={fetchData}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
