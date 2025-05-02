import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import BVImage from '../assets/images/barangay-voice.png';
//
const Success: React.FC = () => {
  const handleReturnToLogin = () => {
    // Logic to navigate back to login screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={BVImage} style={styles.titleImage} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Successful!</Text>
        <View style={styles.icon}>
          <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <Circle cx="50" cy="50" r="49" fill="#F72C5B" />
            <Path d="M38 51.3535L45.0711 58.4246" stroke="#F9F5F5" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45.6465 58L62.6465 41" stroke="#F9F5F5" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={styles.message}>
          Congratulations! Your password has been changed. Click continue to login.
        </Text>
        <TouchableOpacity onPress={handleReturnToLogin} style={styles.button}>
          <Text style={styles.buttonText}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7D477',
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleImage: {
    width: 302,
    height: 302,
  },
  formContainer: {
    width: '100%',
    height: 530,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 40,
  },
  message: {
    fontSize: 18,
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.5
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default Success;