import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BVImage from '../assets/images/BV.png';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const inputRefs = useRef<(TextInput | null)[]>([]); // Create refs for inputs

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) { // Allow only numeric input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        // Move to the next input if the current one is filled
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (otp.join('').length < otp.length) {
      setError('Please enter the complete OTP');
      return;
    }
    setIsLoading(true);
    setError('');

    // Simulate OTP validation and navigate to ResetPass
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('ResetPass'); // Navigate to the ResetPass screen
    }, 1000); // Simulate network delay
  };

  const handleResend = () => {
    setCountdown(60); // Reset the countdown
    // Logic for resending the OTP
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Image source={BVImage} style={styles.titleImage} />
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
            disabled={isLoading}
            style={styles.proceed}>
            <Text style={{ color: 'white' }}>{isLoading ? 'VERIFYING...' : 'PROCEED'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.resendLink}>
          {countdown > 0 ? (
            `If you didn't receive the code, resend in ${countdown} seconds.`
          ) : (
            <Text style={styles.resend} onPress={handleResend}>
              Resend
            </Text>
          )}
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
  },
  instruction: {
    fontSize: 18, 
    color: '#1E1E1E', 
    textAlign: 'center', 
    marginBottom: 30 
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 53,
    height: 58,
    borderColor: '#F72C5B',
    borderWidth: 4,
    borderRadius: 25,
    textAlign: 'center',
    fontSize: 24,
    margin: 10,
  },
  error: {
    color: '#F72C5B',
  },
  resendLink: {
    marginTop: 20,
    textAlign: 'center'
  },
  proceed: {
    width: 253,
    height: 48,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 20
  },
  resend: {
    marginTop: 10, 
    textAlign: 'center', 
    color: '#F72C5B',
  },
});

export default OtpVerification;