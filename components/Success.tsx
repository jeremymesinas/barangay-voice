import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import BVImage from '../assets/images/barangay-voice.png';
//
const Success: React.FC = () => {
  const handleReturnToLogin = () => {
    // Logic to navigate back to login screen
  };

    const [fontsLoaded] = useFonts({
      'Poppins-Regular': require('../assets/fonts/Poppins.ttf'),
      'Anton-Regular': require('../assets/fonts/Anton.ttf'),
    });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={BVImage} style={styles.titleImage} />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.icon}>
          <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <Circle cx="50" cy="50" r="49" fill="#F72C5B" />
            <Path d="M38 51.3535L45.0711 58.4246" stroke="#F9F5F5" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45.6465 58L62.6465 41" stroke="#F9F5F5" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={styles.title}>Password Changed!</Text>
        <Text style={styles.message}>
           Your password has been changed successfully.
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
    width: '100%',
    backgroundColor: '#A7D477',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  titleImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    height: 530,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: "Poppins-Regular",
    color: '#1E1E1E',
    textAlign: 'center',
  },
  icon: {
    marginBottom: 10,
    padding: 30
  },

  message: {
    width: 253,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#989898',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20
  },

  button: {
    width: 246,
    height: 56,
    flexShrink: 0,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Anton-Regular',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '400',
    marginTop: -7,
  },
});

export default Success;