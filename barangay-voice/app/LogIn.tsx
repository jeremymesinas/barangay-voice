import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { loginUser } from "../scripts/account-actions";
import { useAuth } from "@/contexts/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState("");

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins.ttf"),
    "Anton-Regular": require("../assets/fonts/Anton.ttf"),
  });

  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
  
    setError("");
    setLoading(true);
    
    try {
      const response = await loginUser({ email, password });
      
      if (response.error) {
        setError(response.error);
        Alert.alert("Login Failed", response.error);
      } else if (response.user) {
        login({
          id: response.user.id,
          email: response.user.email || email, // Fallback to the email they entered
          first_name: response.user.first_name || '', // Fallback to empty string
          last_name: response.user.last_name || ''    // Fallback to empty string
        });
      } else {
        setError("Invalid response from server");
        Alert.alert("Error", "Invalid response from server");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Image source={require("../assets/images/barangay-voice.png")} style={styles.logo} />
      </View>

      <View style={styles.bottomHalf}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={styles.inputContainer}>
          <Image source={require("../assets/images/user.png")} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            value={email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require("../assets/images/password.png")} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            value={password}
          />

           <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((prev) => !prev)}>
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={24}
                color="#D5305A"
              />
            </TouchableOpacity>
        </View>

        <TouchableOpacity
      style={styles.forgotPassword}
      onPress={() => router.push('/ForgotPass')}
    >
      <Text style={styles.forgotPassword}>Forgot Password?</Text>
    </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    backgroundColor: "#A7D477",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
   eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
    color: "#D5305A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    width: "90%",
    height: 50,
    marginBottom: 15,
    borderRadius: 25,
    paddingHorizontal: 15,
    borderColor: '#F72C5B',
    borderWidth: 3, 
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#D5305A",
    paddingVertical: 9,
    paddingHorizontal: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "Anton-Regular",
    textAlign: "center",
  },
  errorText: {
    color: "#F72C5B",
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
    textAlign: 'center',
  },
});