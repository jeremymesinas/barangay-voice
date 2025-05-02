import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import BVImage from '../assets/images/barangay-voice.png';

const ResetPass: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins.ttf'),
    'Anton-Regular': require('../assets/fonts/Anton.ttf'),
  });

  const { email } = route.params || {};

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigation.navigate('Success'); // Navigate to success screen
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Password reset error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safecontainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Add this line
      >
        <View style={styles.logoContainer}>
          <Image source={BVImage} style={styles.titleImage} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.instruction}>Set a new password</Text>
          <Text style={styles.note}>
            Create a new password. Ensure it differs from previous ones for
            security.
          </Text>
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              required
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#F72C5B"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              required
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#F72C5B"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordPolicyContainer}>
            <Text style={styles.policyTitle}>Password Policies:</Text>
            <Text style={styles.policyItem}>
              • Must have at least 8 characters
            </Text>
            <Text style={styles.policyItem}>
              • Must include at least one uppercase letter (A-Z)
            </Text>
            <Text style={styles.policyItem}>
              • Must include at least one lowercase letter (a-z)
            </Text>
            <Text style={styles.policyItem}>
              • Must include at least one number (0-9)
            </Text>
            <Text style={styles.policyItem}>
              • Must include at least one special character (!@#$%^&* etc.)
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.button}
          >
            <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingBottom: 20,
  },

  logoContainer: {
    width: '100%',
    backgroundColor: '#A7D477',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  titleImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  instruction: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },

  note: {
    fontSize: 14,
    color: '#989898',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  error: {
    color: '#F72C5B',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: 253,
    textAlign: 'left',
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    borderRadius: 25,
  },
  button: {
    width: 260,
    height: 48,
    backgroundColor: '#F72C5B',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Anton-Regular',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '400',
    marginTop: -7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 253,
    borderColor: '#F72C5B',
    borderWidth: 4,
    borderRadius: 50,
    marginBottom: 35,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },

  passwordPolicyContainer: {
    backgroundColor: '#E4F1AC',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  policyTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  policyItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 3,
  },
});

export default ResetPass;