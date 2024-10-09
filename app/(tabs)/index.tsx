import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter(); // Initialize router
  const [showAllModules, setShowAllModules] = useState(false); // State to toggle module view

  const [lastAccessedModule, setLastAccessedModule] = useState<string | null>(null);

  // Function to get the last accessed module from AsyncStorage
  const getLastAccessedModule = async () => {
    try {
      const module = await AsyncStorage.getItem('lastAccessedModule');
      if (module !== null) {
        setLastAccessedModule(module); // Set the last accessed module in state
      }
    } catch (e) {
      console.error('Failed to fetch the last accessed module:', e);
    }
  };

  // Fetch the last accessed module when the HomeScreen is loaded
  useEffect(() => {
    getLastAccessedModule();
  }, []);

  // Handle the module press to navigate to the ArticleLinksScreen
  const handleModulePress = async (module: string) => {
    try {
      await AsyncStorage.setItem('lastAccessedModule', module);
    } catch (e) {
      console.error('Failed to save the last accessed module:', e);
    }

    // Navigate to the article screen
    router.push({
      pathname: './ArticleLinksScreen',
      params: { module },
    });
  };

  // Data for the modules
  const modules = [
    { title: 'Introduction to Cyber Hygiene', lessons: '3 Lessons', moduleKey: 'introtocyber' },
    { title: 'Safe Use of Public Wi-Fi', lessons: '2 Lessons', moduleKey: 'publicwifi' },
    { title: 'Phishing', lessons: '4 Lessons', moduleKey: 'phishing' },
    { title: 'Secure Browsing', lessons: '3 Lessons', moduleKey: 'securebrowsing' },
    { title: 'Authentication and Access Control', lessons: '3 Lessons', moduleKey: 'authandaccess' },
    // Add more modules here...
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello there, 👋</Text>
          <Text style={styles.username}>User.</Text>
        </View>

        {/* Quote of the Day Section */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
          "Cyber hygiene is not just a set of best practices; it’s a mindset that empowers individuals and organizations to protect their digital lives."
          </Text>
        </View>

        {/* Where were we? Section */}
        <View style={styles.lessonContainer}>
          <Text style={styles.sectionTitle}>Where were we?</Text>
          {lastAccessedModule ? (
            <TouchableOpacity style={styles.lessonCard} onPress={() => handleModulePress(lastAccessedModule)}>
              <Text style={styles.lessonTitle}>{lastAccessedModule}</Text>
              <Text style={styles.lessonProgress}>Resume</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.lessonTitle}>No module accessed yet</Text>
          )}
        </View>

        {/* Modules Section */}
        <View style={styles.modulesHeader}>
          <Text style={styles.sectionTitle}>Modules</Text>
          <TouchableOpacity onPress={() => setShowAllModules(!showAllModules)}>
            <Text style={styles.seeAll}>{showAllModules ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>

        {/* Display Modules */}
        {showAllModules ? (
          <View style={styles.gridContainer}>
            {modules.map((module, index) => (
              <TouchableOpacity
                key={index}
                style={styles.gridModuleCard}
                onPress={() => handleModulePress(module.moduleKey)}
              >
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleLessons}>{module.lessons}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.moduleList}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {modules.slice(0, 3).map((module, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.moduleCard}
                  onPress={() => handleModulePress(module.moduleKey)}
                >
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleLessons}>{module.lessons}</Text>
                  <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                  </View>
                  <Text style={styles.progressText}>0%</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7DDFF',
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
    backgroundColor: '#CC6CE7',
    borderRadius: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
  },
  lessonContainer: {
    marginTop: 30,
    color:'#8B4CE4',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lessonCard: {
    backgroundColor: '#2A9D8F',
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
    color:'#CC6CE7'
  },
  moduleCard: {
    backgroundColor: '#90BE6D',
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
    width: '0%', // Update this value dynamically based on progress
    backgroundColor: '#333',
  },
  progressText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 5,
  },
  // Grid View Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  gridModuleCard: {
    backgroundColor: '#CB77E3',
    padding: 20,
    borderRadius: 10,
    width: '48%', // Two columns in grid
    marginBottom: 15,
  },
});



