import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import BVImage from '../assets/images/barangay-voice.png';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require('../assets/fonts/Poppins.ttf'),
    "Anton-Regular": require('../assets/fonts/Anton.ttf'),
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');

    // Simulate sending an OTP
    alert('OTP sent successfully! Check your email.');
    navigation.navigate('OtpVerify');
  };

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={BVImage} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.instruction}>Enter email address for reset password</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            style={styles.inputEmail}
          />
        </View>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <View style={styles.sendContainer}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.sendbtn}
          >
            <Text style={styles.sendtxt}>SEND</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={styles.backsignIn}
          onPress={() => navigation.navigate('SignIn')}
        >
          Back to Sign in
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7D477'
  },

  logoContainer: {
    width: "100%",
    backgroundColor: "#A7D477",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },

  formContainer: {
    flex: 1,
    width: '100%',
    height: 530 ,
    backgroundColor: 'white',
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: "Poppins-Regular", 
    lineHeight: 25
  },

  instruction: {
    fontSize: 14,
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 15,
    fontFamily: "Poppins-Regular",
    fontStyle: 'normal',
    fontWeight: '400' 
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 35,
    width: "90%",
    height: 50,
    borderColor: '#F72C5B',
    borderWidth: 3,
    borderRadius: 50,
    paddingHorizontal: 15,
    textAlign: 'left',

  },

  inputEmail: {
    width: "90%",
    fontSize: 14,
    fontFamily: "Poppins-Regular", 
    color:  '#1E1E1E',
    marginBottom: -5
  },

  error: {
    color: '#F72C5B',
    padding: 5,
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: "Poppins-Regular", 
  },

  sendContainer: {
    width: 253,
    height: 48,
    alignItems: 'center',
    marginTop: 10,
  },

  sendbtn: {
    width: 253,
    height: 48,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 20,
  },

  sendtxt: {
    width: 253,
    fontFamily: "Anton-Regular",  
    fontSize: 30,
    color: 'white',
    fontWeight: '400',
    flexShrink: 0,
    textAlign: 'center',
    marginTop: -7
  },

  backsignIn: {
    padding: 15,
    marginTop: 15,
    color: '#666666',
    textAlign: 'center',
    opacity: 0.35,
    fontSize: 14,
    fontFamily: "Poppins-Regular" 
  }
});

export default ForgotPassword;