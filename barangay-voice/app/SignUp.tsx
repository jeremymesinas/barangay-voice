import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { registerUser } from "../scripts/account-actions";

SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fontsLoaded] = useFonts({
    "Anton-Regular": require("../assets/fonts/Anton.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins.ttf"),
  });

  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Password validation functions
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      alert("Please fill out all required fields.");
      return;
    }
    
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      alert("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      alert("Passwords do not match");
      return;
    }

    const result = await registerUser({
      email,
      password,
      firstName,
      middleName,
      lastName,
      phoneNumber,
    });

    if (result.error) {
      alert("Registration Failed");
    } else {
      alert("Registration successful! Check your email for the OTP.");
      router.push("/LogIn");
    }
  };

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/barangay-voice.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <Text style={styles.reminder}>Please fill out the form. Fields with * are optional.</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Middle Name *</Text>
            <TextInput style={styles.input} placeholder="Middle Name" value={middleName} onChangeText={setMiddleName} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              keyboardType="email-address" 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number" 
              keyboardType="phone-pad" 
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={24}
                  color="#D5305A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              >
                <FontAwesome
                  name={showConfirmPassword ? "eye" : "eye-slash"}
                  size={24}
                  color="#D5305A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passwordPolicyContainer}>
            <Text style={styles.policyTitle}>Password Requirements:</Text>
            
            <View style={styles.policyItem}>
              <FontAwesome
                name={hasMinLength ? "check-circle" : "times-circle"}
                size={16}
                color={hasMinLength ? "#2E8B57" : "#D5305A"}
                style={styles.policyIcon}
              />
              <Text style={styles.policyText}>At least 8 characters</Text>
            </View>
            
            <View style={styles.policyItem}>
              <FontAwesome
                name={hasUpperCase ? "check-circle" : "times-circle"}
                size={16}
                color={hasUpperCase ? "#2E8B57" : "#D5305A"}
                style={styles.policyIcon}
              />
              <Text style={styles.policyText}>At least one uppercase letter (A-Z)</Text>
            </View>
            
            <View style={styles.policyItem}>
              <FontAwesome
                name={hasLowerCase ? "check-circle" : "times-circle"}
                size={16}
                color={hasLowerCase ? "#2E8B57" : "#D5305A"}
                style={styles.policyIcon}
              />
              <Text style={styles.policyText}>At least one lowercase letter (a-z)</Text>
            </View>
            
            <View style={styles.policyItem}>
              <FontAwesome
                name={hasNumber ? "check-circle" : "times-circle"}
                size={16}
                color={hasNumber ? "#2E8B57" : "#D5305A"}
                style={styles.policyIcon}
              />
              <Text style={styles.policyText}>At least one number (0-9)</Text>
            </View>
            
            <View style={styles.policyItem}>
              <FontAwesome
                name={hasSpecialChar ? "check-circle" : "times-circle"}
                size={16}
                color={hasSpecialChar ? "#2E8B57" : "#D5305A"}
                style={styles.policyIcon}
              />
              <Text style={styles.policyText}>At least one special character (!@#$%^&*)</Text>
            </View>
            
            <View style={styles.policyItem}>
              <FontAwesome
                name={passwordsMatch ? "check-circle" : "times-circle"}
                size={16}
                color={passwordsMatch ? "#2E8B57" : "#D5305A"}
                style={styles.policyIcon}
              />
              <Text style={styles.policyText}>Passwords match</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTER</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/LogIn")}>
            <Text style={styles.loginText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContainer: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
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
  fieldContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#D5305A",
  },
  reminder: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  form: {
    width: "90%",
    gap: 15,
    marginTop: 20,
  },
  input: {
    borderWidth: 5,
    borderColor: "#F72C5B",
    borderRadius: 25,
    padding: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#fff",
  },
  passwordPolicyContainer: {
    backgroundColor: "#E4F1AC",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  policyTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  policyIcon: {
    marginRight: 8,
  },
  policyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  passwordInputContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
    color: "#D5305A",
  },
  registerButton: {
    backgroundColor: "#D5305A",
    paddingVertical: 9,
    paddingHorizontal: 80,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "Anton-Regular",
    textAlign: "center",
  },
  loginText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 10,
    marginBottom: 20,
  },
});