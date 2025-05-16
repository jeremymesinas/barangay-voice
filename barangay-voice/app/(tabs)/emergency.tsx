import React, { useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import OngoingCall from '../ongoingcall';
import { Linking } from 'react-native';

export default function EmergencyResponseScreen() {
  const [address, setAddress] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTexting, setIsTexting] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState<{
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number | null;  
    };
    timestamp: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const callCancelledRef = useRef(false);
  const router = useRouter();
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const reverseGeocode = async () => {
        try {
          const addresses = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          if (addresses.length > 0) {
            const firstAddress = addresses[0];
            const formattedAddress = [
              firstAddress.street,
              firstAddress.city,
              firstAddress.region,
              firstAddress.postalCode,
              firstAddress.country
            ].filter(Boolean).join(', ');
            
            setAddress(formattedAddress);
          }
        } catch (error) {
          console.warn('Reverse geocoding error:', error);
        }
      };
      
      await reverseGeocode();
    })();
  }, []);

  const handleCall = async () => {
    callCancelledRef.current = false;
    setIsCalling(true);
  
    try {
      const freshLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(freshLocation);
      
      const addresses = await Location.reverseGeocodeAsync({
        latitude: freshLocation.coords.latitude,
        longitude: freshLocation.coords.longitude,
      });
      
      let formattedAddress = "Address unavailable";
      if (addresses.length > 0) {
        formattedAddress = [
          addresses[0].street,
          addresses[0].city,
          addresses[0].region,
          addresses[0].postalCode,
          addresses[0].country
        ].filter(Boolean).join(', ');
        
        setAddress(formattedAddress);
      }
      
      console.log('Emergency location:', {
        coords: freshLocation.coords,
        address: formattedAddress
      });
      
      // Open phone dialer with emergency number
      Linking.openURL(`tel:09174654689`);
      
    } catch (error) {
      console.warn('Error:', error);
    }
  
    setTimeout(() => {
      if (!callCancelledRef.current) {
        setIsCalling(false);
        router.push('/ongoingcall');
      }
    }, 3000);
  };

  const handleTextEmergency = async () => {
    try {
      const freshLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(freshLocation);
      
      const addresses = await Location.reverseGeocodeAsync({
        latitude: freshLocation.coords.latitude,
        longitude: freshLocation.coords.longitude,
      });
      
      let formattedAddress = "Address unavailable";
      if (addresses.length > 0) {
        formattedAddress = [
          addresses[0].street,
          addresses[0].city,
          addresses[0].region,
          addresses[0].postalCode,
          addresses[0].country
        ].filter(Boolean).join(', ');
        
        setAddress(formattedAddress);
      }
      
      const fullMessage = `BARANGAY VOICE: ${message}\n\nLocation: ${formattedAddress}\nCoordinates: ${freshLocation.coords.latitude.toFixed(4)}, ${freshLocation.coords.longitude.toFixed(4)}`;
      
      // Open SMS with emergency number and message
      Linking.openURL(`sms:09174654689?body=${encodeURIComponent(fullMessage)}`);
      
      Alert.alert('Message Sent', 'Your emergency message has been sent to Barangay Maclab.');
      setIsTexting(false);
      setMessage('');
    } catch (error) {
      console.warn('Error:', error);
      Alert.alert('Error', 'Failed to send emergency message. Please try again.');
    }
  };

  if (isConnected) {
    return <OngoingCall onEndCall={() => {
      setIsCalling(false);
      setIsConnected(false);
    }} />;
  }

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.topHalf}>
        <View>
          <Text style={styles.topLeftText}>BARANGAY{"\n"}VOICE</Text>
        </View>
        <Image
          source={require('@/assets/images/barangay-voice.png')}
          style={styles.topRightImage}
        />
      </View>

      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>EMERGENCY RESPONSE</Text>

        {/* Content */}
        <View style={styles.content}>
          {isCalling ? (
            <>
              <Text style={styles.title}>Connecting to Barangay Maclab…</Text>
              <Text style={styles.subtitle}>Please wait while we connect your emergency call.</Text>
              <Image source={require('@/assets/images/call.png')} style={styles.sosImage} />
              <TouchableOpacity
                onPress={() => {
                    callCancelledRef.current = true;
                    setIsCalling(false);
                }}
                style={styles.cancelBtn}
                >
                <Text style={styles.cancelText}>Cancel call</Text>
              </TouchableOpacity>

              <Text style={styles.subtitle}>Keep calm. Help is on the way…</Text>
              <ActivityIndicator size="small" color="#EA3A57" style={{ marginVertical: 30 }} />
            </>
          ) : isTexting ? (
            <>
              <Text style={styles.title}>Send Emergency Message</Text>
              <TextInput
                style={styles.messageInput}
                multiline
                numberOfLines={4}
                placeholder="Describe your emergency situation..."
                value={message}
                onChangeText={setMessage}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.sendButton]}
                  onPress={handleTextEmergency}
                >
                  <Text style={styles.buttonText}>Send Message</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setIsTexting(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Are you safe?</Text>
              <TouchableOpacity onPress={handleCall}>
                <Image source={require('@/assets/images/sos.png')} style={styles.sosImage} />
              </TouchableOpacity>
              <Text style={styles.subtitle}>
                Press the button if you think you are in danger. You will be directed to a call with Barangay Maclab.
              </Text>
              
              <TouchableOpacity 
                style={styles.textEmergencyButton}
                onPress={() => setIsTexting(true)}
              >
                <Text style={styles.textEmergencyButtonText}>Or send a text message instead</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.locationBox}>
            {errorMsg ? (
              <Text style={styles.locationText}>📍 Location unavailable: {errorMsg}</Text>
            ) : location ? (
              <>
                <Text style={styles.locationText}>
                  📍 Lat: {location.coords.latitude.toFixed(4)}, 
                  Long: {location.coords.longitude.toFixed(4)}
                </Text>
                {address && (
                  <Text style={[styles.locationText, { marginTop: 8 }]}>
                    🏠 {address}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.locationText}>📍 Getting your location...</Text>
            )}
          </View>
          <TouchableOpacity 
            onPress={() => {
              if (location) {
                const url = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
                Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
              }
            }}
          >
            <Text style={[styles.locationText, { color: '#1a73e8', textDecorationLine: 'underline' }]}>
              View on Google Maps
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHalf: {
    backgroundColor: "#A7D477",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    backgroundColor: '#88C057',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 20,
    width: '100%',
  },
  headerContent: {
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 24,
  },
  flagIcon: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
    marginRight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  redBanner: {
    backgroundColor: '#EA3A57',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: 285,
    height: 83,
    alignSelf: 'center',
    marginTop: -15,
    marginBottom: 20,
    justifyContent: 'center', 
    alignItems: 'center',    
    flexDirection: 'row',    
  },
  topLeftText: {
    fontFamily: "Anton-Regular",
    fontSize: 30,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    paddingLeft: 10,
  },
  topRightImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA3A57',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Poppins-Regular',
  },
  bannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', 
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  sosImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  locationBox: {
    backgroundColor: '#DAF0A2',
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    width: '100%',
  },
  locationText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#DAF0A2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  cancelText: {
    color: '#EA3A57',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textEmergencyButton: {
    marginTop: 20,
    padding: 10,
  },
  textEmergencyButtonText: {
    color: '#EA3A57',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  messageInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#EA3A57',
  },
  cancelButton: {
    backgroundColor: '#DAF0A2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});