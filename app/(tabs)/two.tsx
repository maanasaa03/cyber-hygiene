import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Function to check the password strength
function checkPasswordStrength(password: string) {
  let strength = 0;
  if (password.length >= 8) strength += 1; // Minimum length
  if (/[A-Z]/.test(password)) strength += 1; // Uppercase letter
  if (/[0-9]/.test(password)) strength += 1; // Number
  if (/[@$!%*?&#]/.test(password)) strength += 1; // Special character

  switch (strength) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Medium';
    case 3:
    case 4:
      return 'Strong';
    default:
      return 'Weak';
  }
}

// Function to generate a random password with letters, numbers, and special characters
function generatePassword(length = 12) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '@$!%*?&#';
  const allCharacters = uppercase + lowercase + numbers + specialChars;

  let password = '';
  
  // Ensure at least one character from each category is included
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the remaining length with random characters from the full set
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  // Shuffle the password to ensure randomness
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  return password;
}

export default function TabTwoScreen() {
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  // Define strength colors
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak':
        return 'red';
      case 'Medium':
        return 'yellow';
      case 'Strong':
        return 'green';
      default:
        return 'white';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Tools</Text>

      {/* Password Strength Checker Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password Strength Checker</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={true}
          placeholderTextColor="#aaa"
        />
        <Text style={[styles.strength, { color: getStrengthColor() }]}>
          Strength: {passwordStrength}
        </Text>
      </View>

      {/* Password Generator Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password Generator</Text>
        <TouchableOpacity style={styles.button} onPress={handleGeneratePassword}>
          <Text style={styles.buttonText}>Generate Password</Text>
        </TouchableOpacity>
        {generatedPassword ? (
          <View>
            <Text style={styles.generatedPasswordTitle}>Generated Password:</Text>
            <Text style={styles.generatedPassword}>{generatedPassword}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E7DDFF',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  section: {
    marginBottom: 40,
    backgroundColor: '#E9ECEF', // Light background color for the section
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A9D8F', // Section title color
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  strength: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2A9D8F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  generatedPasswordTitle: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',
  },
  generatedPassword: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A9D8F',
    marginTop: 10,
    textAlign: 'center',
  },
});

