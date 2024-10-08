// app/(tabs)/ArticleLinksScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArticleLinksScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Cyberbullying Articles</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://example.com/article1')}>
        <Text style={styles.link}>1. Understanding Cyberbullying</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://example.com/article2')}>
        <Text style={styles.link}>2. The Impact of Cyberbullying</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://example.com/article3')}>
        <Text style={styles.link}>3. How to Combat Cyberbullying</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: '#007BFF',
    marginBottom: 10,
  },
});

export default ArticleLinksScreen;
