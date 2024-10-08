import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Password Strength Checker & Generator</Text>
      
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={true}
        placeholderTextColor="#aaa"
      />

      {/* Display Password Strength with dynamic color */}
      <Text style={[styles.strength, { color: getStrengthColor() }]}>
        Strength: {passwordStrength}
      </Text>

      {/* Button to Generate Random Password */}
      <Button title="Generate Password" onPress={handleGeneratePassword} />

      {/* Display Generated Password */}
      {generatedPassword ? (
        <View>
          <Text style={styles.generatedPasswordTitle}>Generated Password:</Text>
          <Text style={styles.generatedPassword}>{generatedPassword}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000', // Black background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white', // Title color on black background
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 20,
    color: 'white', // Input text color
    backgroundColor: '#333', // Darker input background
  },
  strength: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  generatedPasswordTitle: {
    fontSize: 16,
    marginTop: 20,
    color: 'white',
  },
  generatedPassword: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'cyan',
    marginTop: 10,
    textAlign: 'center',
  },
});

