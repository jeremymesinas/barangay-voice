import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BVImage from '../assets/images/BV.png';
//
const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { email } = route.params || {};

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      navigation.navigate('Success'); // Navigate to success screen
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Image source={BVImage} style={styles.titleImage} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.instruction}>Set a new password</Text>
        <Text style={styles.note}>Create a new password. Ensure it differs from previous ones for security.</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!isLoading}
          required
        />
        <TextInput
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          editable={!isLoading}
          required
        />
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={styles.button}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}</Text>
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
  titleImage: {
    width: 302,
    height: 302,
  },
  formContainer: {
    width: '100%',
    height: 533, 
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  instruction: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  note: {
    fontSize: 18,
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 30,
  },
  error: {
    color: '#F72C5B',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: 253,
    borderColor: '#F72C5B',
    borderWidth: 4,
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    textAlign: 'left',
  },
  button: {
    width: 253,
    height: 48,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default PasswordReset;