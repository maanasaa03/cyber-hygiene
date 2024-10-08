import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Mock module data with progress information (in percentages)
  const modules = [
    { id: 'overview', title: 'Overview (What is cyberbullying?)', lessons: 4, progress: 20 },
    { id: 'whyItMatters', title: 'Why Cyberbullying Matters', lessons: 2, progress: 50 },
    { id: 'phishing', title: 'Phishing', lessons: 3, progress: 75 },
  ];

  const handleModulePress = (module: string) => {
    router.push({
      pathname: './ArticleLinksScreen',
      params: { module }, // Pass the selected module as a parameter
    });
  };

  const renderModules = () => {
    return modules.map((module) => (
      <TouchableOpacity
        key={module.id}
        style={styles.moduleCard}
        onPress={() => handleModulePress(module.id)} // Call the function with module name
      >
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.moduleLessons}>{module.lessons} Lessons</Text>
        
        {/* Dynamic progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${module.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{module.progress}% Completed</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello there, 👋</Text>
          <Text style={styles.username}>nat.</Text>
        </View>

        {/* Quote of the Day Section */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Cyberbullying is the biggest online concern, already affecting up to 35% of all children."
          </Text>
        </View>

        {/* Where were we? Section */}
        <View style={styles.lessonContainer}>
          <Text style={styles.sectionTitle}>Where were we?</Text>
          <TouchableOpacity style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>Overview (What is cyberbullying?)</Text>
            <Text style={styles.lessonProgress}>Resume</Text>
          </TouchableOpacity>
        </View>

        {/* Modules Section */}
        <View style={styles.modulesHeader}>
          <Text style={styles.sectionTitle}>Modules</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moduleList}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Render modules dynamically */}
            {renderModules()}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  greetingContainer: {
    marginTop: 30,
  },
  greetingText: {
    fontSize: 20,
    color: '#333',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  quoteContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#B5E48C', // light green background
    borderRadius: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
  },
  lessonContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lessonCard: {
    backgroundColor: '#2A9D8F', // blue card background
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 16,
    color: '#FFF',
  },
  lessonProgress: {
    fontSize: 16,
    color: '#FFF',
  },
  modulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  seeAll: {
    color: '#2A9D8F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moduleList: {
    marginTop: 10,
  },
  moduleCard: {
    backgroundColor: '#90BE6D', // green gradient background
    padding: 20,
    borderRadius: 10,
    width: 180,
    marginRight: 15,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  moduleLessons: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FFF',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#333',
  },
  progressText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 5,
  },
});



