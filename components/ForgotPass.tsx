import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BVImage from '../assets/images/barangay-voice.png';
//
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

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

    setIsLoading(true);
    setError('');

    // Simulate sending an OTP
    setTimeout(() => {
      setIsLoading(false);
      alert('OTP sent successfully! Check your email.');
      navigation.navigate('OptVerify'); // Navigate to OptVerify after success
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleImage}>
        <Image source={BVImage} style={{ width: 302, height: 302 }} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.instruction}>Enter email address for reset password</Text>
        
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            style={styles.inputEmail}
            editable={!isLoading}
          />
        </View>
        
        {error && (
          <Text style={styles.error}>{error}</Text> 
        )}
        
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.send}
          >
            <Text style={{ color: 'white' }}>{isLoading ? 'SENDING...' : 'SEND'}</Text>
          </TouchableOpacity>
        </View>
        
        <Text
          style={styles.backsignIn}
          onPress={() => !isLoading && navigation.navigate('SignIn')}
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

titleImage: {
  marginBottom: 20
},

formContainer: {
  width: '100%',
  height: 530,
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
},

title: {
  fontSize: 32, 
  fontWeight: '700', 
  color: '#1E1E1E', 
  textAlign: 'center', 
  marginBottom: 20 
},

instruction: {
  fontSize: 18, 
  color: '#1E1E1E', 
  textAlign: 'center', 
  marginBottom: 23
},

inputEmail: {
  width: 253,
  borderColor: '#F72C5B',
  borderWidth: 4,
  borderRadius: 25,
  padding: 15,
  textAlign: 'left'
},

error: {
  color: '#F72C5B', 
  marginBottom: 10, 
  textAlign: 'center' 
},

send: {
  width: 253,  
  height: 48,  
  backgroundColor: '#F72C5B',
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginBottom: 20
},

backsignIn: {
 marginTop: 10, 
 color: '#1E1E1E', 
 textAlign: 'center', 
 opacity: 0.7 
}
});

export default ForgotPassword;