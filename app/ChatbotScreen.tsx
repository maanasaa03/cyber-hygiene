import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const BACKEND_URL = 'http://10.0.2.2:3000';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/chatbot`, { message: input });

      if (response.data && response.data.reply) {
        setMessages(prevMessages => [...prevMessages, { text: response.data.reply, isUser: false }]);
      } else {
        setMessages(prevMessages => [...prevMessages, { text: 'No response from chatbot.', isUser: false }]);
      }
    } catch (error) {
      console.error('Chatbot API Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Error getting response.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 80 }}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageBubble, msg.isUser ? styles.userMessage : styles.botMessage]}>
            <Text style={[styles.messageText, msg.isUser ? {} : styles.botText]}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator size="small" color="#007bff" />}

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Chat with CHAI..."
        multiline
        returnKeyType="send"
        blurOnSubmit={false} // Ensures the keyboard doesn't dismiss
        onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') {
            sendMessage();
            }
        }}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#E6E0FF' },
  chatContainer: { flex: 1, marginBottom: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#ddd' },
  messageText: { color: '#fff' },
  botText: { color: '#000' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 15 
  },
  input: { 
    flex: 1, 
    padding: 15, 
    fontSize: 16, 
    height: 50, 
    borderRadius: 8, 
    backgroundColor: '#f0f0f0' 
  },
  sendButton: { backgroundColor: '#7A3EB1', padding: 12, borderRadius: 8, marginLeft: 5 },
});


