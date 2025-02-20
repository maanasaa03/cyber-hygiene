import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const BACKEND_URL = 'http://10.0.2.2:3000';

const ChatbotScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/chatbot`, { message: input });
      setMessages([...newMessages, { text: response.data.reply, isUser: false }]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      setMessages([...newMessages, { text: 'Error getting response.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageBubble, msg.isUser ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator size="small" color="#007bff" />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Navigate to Browser Screen */}
      <TouchableOpacity style={styles.browserButton} onPress={() => router.push('/BrowserScreen')}>
        <Text style={styles.browserButtonText}>Go to AI Browser</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f4f4f4' },
  chatContainer: { flex: 1, marginBottom: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#ddd' },
  messageText: { color: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 8 },
  input: { flex: 1, padding: 10 },
  sendButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginLeft: 5 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  browserButton: { marginTop: 10, padding: 10, backgroundColor: '#28a745', borderRadius: 5, alignItems: 'center' },
  browserButtonText: { color: '#fff', fontWeight: 'bold' },
});



