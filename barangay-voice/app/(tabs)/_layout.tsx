import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme'; 

type TabBarIconProps = {
  color: string;
  size?: number;
  focused: boolean;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const inactiveColor = '#fff';  
  const activeColor = '#e4f1ac';  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,  
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f32d5d',
          height: 40, 
          paddingBottom: 5, 
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: () => null,
          title: 'Home',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />

      {/* Concerns Tab */}
      <Tabs.Screen
        name="concern"
        options={{
          tabBarLabel: () => null,
          title: 'Concerns',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons name="megaphone" size={28} color={color} />
          ),
        }}
      />

      {/* Emergency Tab */}
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarLabel: () => null,
          title: 'Emergency',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons name="call" size={28} color={color} />
          ),
        }}
      />

      {/* Jobs Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: () => null,
          title: 'Jobs',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons name="notifications" size={28} color={color} /> 
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: () => null,
          title: 'Profile',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons name="person-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}