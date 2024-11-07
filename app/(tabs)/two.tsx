import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Network from 'expo-network';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCameraPermissions } from 'expo-camera';

export default function CyberScoreScreen() {
  const [cyberScore, setCyberScore] = useState(100); // Start with a high score
  const [networkType, setNetworkType] = useState<Network.NetworkStateType | null>(null);
  const [wifiSecurity, setWifiSecurity] = useState<string>('Unknown');
  const [permissionIssues, setPermissionIssues] = useState<string[]>([]);
  const [deviceSecurity, setDeviceSecurity] = useState(true); // Assume secure unless rooted
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Request both camera and location permissions on every load
    const requestPermissions = async () => {
      await requestCameraPermission(); // Request camera permission
  
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        console.log('Location permission not granted');
      }
    };
  
    requestPermissions();
    calculateCyberScore(); // Call function to calculate cyber score after permissions are requested
  }, []);
   // Re-run if camera permission changes

  const calculateCyberScore = async () => {
    let score = 100;
    let issues: string[] = [];

    // Network Security Check
    const networkInfo = await Network.getNetworkStateAsync();
    if (networkInfo.type && networkInfo.type !== Network.NetworkStateType.WIFI) {
      score -= 20; // Penalize if not on WiFi
      issues.push("Not on WiFi");
    }
    setNetworkType(networkInfo.type || null); // Set networkType, default to null if undefined

    // Estimate WiFi Encryption Type Based on Connection Type
    if (networkInfo.type === Network.NetworkStateType.WIFI) {
      setWifiSecurity("Secured"); // Assumed secure
    } else {
      setWifiSecurity("Not Applicable"); // Not WiFi, encryption is irrelevant
    }

    // Device Security Check (e.g., if the device is rooted)
    if (Device.isRootedExperimentalAsync) {
      const isRooted = await Device.isRootedExperimentalAsync();
      if (isRooted) {
        score -= 30; // Penalize for rooted devices
        issues.push("Device is Rooted");
        setDeviceSecurity(false);
      }
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      score -= 10;
      issues.push("Biometric authentication not enabled");
    }
    setBiometricAvailable(hasHardware && isEnrolled);

    // Camera Permission Check
    if (cameraPermission?.status === 'granted') {
      score -= 10;
      issues.push("Camera Permission Granted");
    }

    // Location Permission Check
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus === 'granted') {
      score -= 10;
      issues.push("Location Permission Granted");
    }

    setPermissionIssues(issues);
    setCyberScore(score);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.title}>Cyber Score</Text>
        <View style={styles.separator} />

        <View style={styles.score}>
          <Text style={styles.scoreText}>{cyberScore}</Text>
        </View>

        {showDetails && (
          <View style={styles.infoContainer}>
            <Text style={[styles.info, networkType !== Network.NetworkStateType.WIFI && styles.issue]}>
              Network Type: {networkType ?? 'Unknown'}
            </Text>
            <Text style={[styles.info, wifiSecurity === 'Not Applicable' ? null : styles.issue]}>
              WiFi Security: {wifiSecurity}
            </Text>
            <Text style={[styles.info, !deviceSecurity && styles.issue]}>
              Device Security: {deviceSecurity ? 'Secure' : 'Rooted'}
            </Text>
            <Text style={styles.info}>Permissions:</Text>
            {permissionIssues.length === 0 ? (
              <Text style={styles.info}>All permissions are safe</Text>
            ) : (
              permissionIssues.map((issue, index) => (
                <Text key={index} style={styles.issue}>
                  {issue}
                </Text>
              ))
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.recalculateButton} onPress={calculateCyberScore}>
            <Text style={styles.buttonText}>Recalculate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.showMoreButton} onPress={toggleDetails}>
          <Text style={[styles.showMoreText, showDetails && styles.underlinedText]}>
            {showDetails ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E7DDFF', // Light grey background for the screen
  },
  scoreContainer: {
    width: '90%', // Reduce width to make it smaller
    maxWidth: 350, // Set a max width for a more compact design
    padding: 16, // Reduced padding for a smaller container
    backgroundColor: '#FFFFFF', // White background for the score container
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Add a slight shadow effect
    alignItems: 'center', // Center contents
  },
  title: {
    fontSize: 24, // Smaller title font size
    fontWeight: 'bold',
    color: '#8A2BE2', // Purple text color for title
    marginBottom: 10, // Gap between title and score circle
    textAlign: 'center',
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#8A2BE2',
    marginVertical: 10,
  },
  score: {
    width: 120, // Circle size
    height: 120,
    borderRadius: 60, // Make it a circle
    backgroundColor: '#8A2BE2', // Purple background for the circle
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 32, // Larger number inside the circle
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for the score
  },
  infoContainer: {
    marginVertical: 16,
  },
  info: {
    fontSize: 16, // Uniform font size for all text
    color: '#333', // Dark color for regular info
    marginVertical: 5,
    textAlign: 'center',
  },
  issue: {
    fontSize: 16, // Same font size for issues
    color: '#D32F2F', // Red color for issues
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center', // Center the button horizontally
  },
  recalculateButton: {
    backgroundColor: '#8A2BE2', // Purple button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25, // Rounded corners
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  showMoreButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  showMoreText: {
    color: '#000000', // No color for the "show more" button text
    fontWeight: 'bold',
  },
  underlinedText: {
    textDecorationLine: 'underline', // Adds the underline to the text when clicked
  },
});














