import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
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

  useEffect(() => {
    calculateCyberScore();
  }, []);

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
    if (cameraPermission?.status !== 'granted') {
      await requestCameraPermission();
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cyber Score</Text>
      <Text style={styles.score}>Score: {cyberScore}</Text>
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
      <Button title="Recalculate" onPress={calculateCyberScore} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 20,
  },
  infoContainer: {
    marginVertical: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },
  issue: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});








