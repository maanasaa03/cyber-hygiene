import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
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
        'Website Analysis',
        `🔍 Security Score: ${securityScore}/100\n\n📝 Content Analysis:\n${analysis}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error analyzing website:', error);
      Alert.alert('Analysis Error', 'Failed to analyze website. Try another page.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          paddingLeft: 8,
        }}
        placeholder="Enter website URL"
        value={url}
        onChangeText={setUrl}
        onSubmitEditing={handleGo} // Trigger when user presses Enter
      />
      <Button title="Go" onPress={handleGo} />
      {finalUrl ? <WebView source={{ uri: finalUrl }} style={{ flex: 1 }} /> : null}
    </View>
  );
};

export default BrowserScreen;
