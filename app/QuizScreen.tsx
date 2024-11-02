import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const questions = [
  {
    question: 'What is Cyber Hygiene?',
    options: ['Best practices for online safety', 'A type of virus', 'A software update', 'A physical firewall'],
    correctOption: 0, // Index of the correct answer
  },
  {
    question: 'What should you do when using public Wi-Fi?',
    options: ['Share passwords', 'Disable VPN', 'Avoid online banking', 'Leave the network open'],
    correctOption: 2,
  },
  {
    question: 'What is phishing?',
    options: ['A type of email scam', 'A network protocol', 'A firewall configuration', 'A secure website'],
    correctOption: 0,
  },
  {
    question: 'What is multi-factor authentication?',
    options: ['A way to use multiple devices', 'A type of encryption', 'A method of verifying identity', 'A password recovery tool'],
    correctOption: 2,
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1)); // Store selected answers
  const [score, setScore] = useState<number | null>(null); // To store the score after submission

  // Function to handle option selection
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex; // Update selected option
    setSelectedAnswers(newAnswers);
  };

  // Function to calculate the score
  const handleSubmitQuiz = () => {
    let totalScore = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctOption) {
        totalScore++;
      }
    });
    setScore(totalScore); // Set the score
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {questions.map((q, questionIndex) => (
          <View key={questionIndex} style={styles.questionContainer}>
            <Text style={styles.question}>{q.question}</Text>
            {q.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  selectedAnswers[questionIndex] === optionIndex && styles.selectedOption, // Highlight selected option
                  score !== null && optionIndex === q.correctOption && styles.correctOption // Highlight correct answer after submission
                ]}
                onPress={() => handleSelectOption(questionIndex, optionIndex)}
                disabled={score !== null} // Disable options after submission
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuiz} disabled={score !== null}>
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>

        {score !== null && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>You scored {score}/{questions.length}</Text>
            <TouchableOpacity 
              style={styles.homeButton} 
              onPress={() => router.push('./HomeScreen')} // Navigate back to home
            >
              <Text style={styles.homeButtonText}>Go Back Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7DDFF',
    padding: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#CC6CE7',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#8B4CE4', // Highlight selected option
  },
  correctOption: {
    backgroundColor: '#90BE6D', // Highlight correct answer in green after submission
  },
  optionText: {
    color: '#FFF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2A9D8F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: '#2A9D8F',
    padding: 10,
    borderRadius: 5,
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

