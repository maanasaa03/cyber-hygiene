import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '../context/AuthContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { onLogout } = useAuth();

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cyber Hygiene</Text>
        <Pressable style={styles.signOutButton} onPress={onLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false, // Keep native header hidden
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Tools',
            tabBarIcon: ({ color }) => <TabBarIcon name="wrench" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15, // Increased padding to create more space for the button
    backgroundColor: '#8A2BE2', // Purple background for header
    elevation: 4, // Optional: adds a slight shadow for a more prominent header
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 10, // Adds space below the text
  },
  signOutText: {
    color: '#8A2BE2',
    fontWeight: '600',
    fontSize: 14,
  },
});


