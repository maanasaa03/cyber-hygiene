import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Correct import

export default function ArticleLinksScreen() {
  const { module } = useLocalSearchParams(); // Access the passed module parameter
  const router = useRouter();

  // Dummy data: Replace this with actual data or API call for fetching related articles
  const articles: { [key: string]: { title: string; link: string }[] } = {
    overview: [
      { title: "What is Cyberbullying?", link: "#1" },
      { title: "The Impact of Cyberbullying on Children", link: "#2" },
      { title: "How to Prevent Cyberbullying", link: "#3" },
    ],
    whyItMatters: [
      { title: "Why Cyberbullying is a Big Issue", link: "#4" },
      { title: "Understanding the Consequences", link: "#5" },
      { title: "Cyberbullying and Mental Health", link: "#6" },
    ],
    phishing: [
      { title: "What is Phishing?", link: "#7" },
      { title: "How to Recognize Phishing Attempts", link: "#8" },
      { title: "Protecting Yourself from Phishing", link: "#9" },
    ],
  };

  // Ensure `module` is a valid string, not an array or undefined
  const moduleKey = Array.isArray(module) ? module[0] : module;

  // Get related articles based on the module key
  const relatedArticles = moduleKey && articles[moduleKey] ? articles[moduleKey] : [];

  return (
    <View style={styles.container}>
      {/* Module Title */}
      <Text style={styles.moduleTitle}>{moduleKey} Articles</Text>

      {/* Display Related Articles */}
      {relatedArticles.map((article, index) => (
        <TouchableOpacity key={index} style={styles.articleCard}>
          <Text style={styles.articleTitle}>{article.title}</Text>
        </TouchableOpacity>
      ))}

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the ArticleLinksScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: '#90BE6D',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 16,
    color: '#FFF',
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2A9D8F',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
});








