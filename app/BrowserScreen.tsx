import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';

const BrowserScreen = () => {
  const [url, setUrl] = useState('');
  const [finalUrl, setFinalUrl] = useState('');

  const handleGo = () => {
    if (!url.startsWith('http')) {
      setFinalUrl(`https://${url}`);
    } else {
      setFinalUrl(url);
    }
    analyzeWebsite(url);
  };

  const analyzeWebsite = async (websiteUrl: string) => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/analyze', { url: websiteUrl });
      const { securityScore, analysis } = response.data;

      Alert.alert(
        '🔍 Website Security Analysis',
        `🛡️ Security Score: ${securityScore}/100\n\n📋 Analysis:\n${analysis}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error analyzing website:', error);
      Alert.alert('Analysis Error', 'Failed to analyze website. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter URL..."
          value={url}
          onChangeText={setUrl}
        />
        <TouchableOpacity style={styles.goButton} onPress={handleGo}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
      {finalUrl ? <WebView source={{ uri: finalUrl }} style={styles.webView} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2', padding: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, padding: 10 },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16 },
  goButton: { backgroundColor: '#007AFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15 },
  goButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  webView: { flex: 1, marginTop: 10, borderRadius: 10, overflow: 'hidden' },
});

export default BrowserScreen;

