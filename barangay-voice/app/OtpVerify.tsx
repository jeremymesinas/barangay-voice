import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function OtpVerify() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const inputRefs = useRef<(TextInput | null)[]>([]); 
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require('../assets/fonts/Poppins.ttf'),
    "Anton-Regular": require('../assets/fonts/Anton.ttf'),
  });

  useEffect(() => {
    // Removed countdown logic
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (otp.join('').length < otp.length) {
      setError('Please enter the complete OTP');
      return;
    }
    setError('');
    router.push('/ResetPass');
  };

  const handleResend = () => {
    // Logic for resending the OTP
  };

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Image source={require("../assets/images/barangay-voice.png")} style={styles.titleImage} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.instruction}>
          A one-time OTP has been sent to your email. Please enter the code.
        </Text>
        
        <View style={styles.inputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              value={digit}
              onChangeText={(text) => handleChange(index, text)}
              maxLength={1}
              style={styles.otpInput}
              keyboardType="numeric"
              autoFocus={index === 0}
            />
          ))}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.proceed}>
            <Text style={styles.proceedtxt}>PROCEED</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.resendLink}>
          If you didn't receive the code.   
          <Text style={styles.resend} onPress={handleResend}>
            Resend
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#A7D477' 
  },
  titleImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 1,
    width: '100%',
    height: 530,
    backgroundColor: 'white',
    padding: 20,
  },
  instruction: {
    fontSize: 15, 
    color: '#1E1E1E', 
    textAlign: 'center', 
    marginBottom: 30,
    fontFamily: "Poppins-Regular",
    marginTop: 20
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderColor: '#F72C5B',
    borderWidth: 3,
    borderRadius: 30,
    textAlign: 'center',
    padding: 10,
    fontSize: 18
  },
  error: {
    color: '#F72C5B',
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15
  },
  resendLink: {
    marginTop: 20,
    textAlign: 'center',
    flexShrink: 0,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: 'black',
  },
  resend: {
    marginTop: 10, 
    textAlign: 'center', 
    color: '#F72C5B',
    flexShrink: 0,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
    marginLeft: 2.5
  },
  proceed: {
    width: 253,
    height: 48,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 20,
  },
  proceedtxt: {
    color: '#FFF',
    fontFamily: "Anton-Regular",
    fontSize: 30,
    fontWeight: '400',
    flexShrink: 0,
    textAlign: 'center',
    marginTop: -7
  },
});