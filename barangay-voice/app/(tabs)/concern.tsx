import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, Platform, Image, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { submitConcern } from '@/scripts/account-actions';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export default function ConcernScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('LOW');
  const [image, setImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const [fontsLoaded] = useFonts({
    "Anton-Regular": require("../../assets/fonts/Anton.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins.ttf"),
  });

  useEffect(() => {
  (async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take photos!');
    }
  })();
}, []);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setIsAlertVisible(true); 
  };

const pickImage = async (useCamera: boolean) => {
  let result;

  if (useCamera) {
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
  } else {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
  }

  if (!result.canceled) {
    // Compress and resize the image
    const manipResult = await manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    setImage(manipResult.uri);
  }
};
  
  // Add this function to remove the selected image
  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!name || !category || !description) {
      showAlert('Missing Information', 'Please fill in all required fields');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const { error } = await submitConcern({
        concern_header: name,
        concern_category: category,
        concern_content: description,
        address: address,
        importance_level: severity,
        user_id: user?.id,
        imageUri: image // Add this line
      });
  
      if (error) {
        throw error;
      }
  
      setIsModalVisible(true);
    } catch (error) {
      // ... (keep existing error handling)
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityStyle = (level: SeverityLevel) => {
    switch (level) {
      case 'LOW':
        return styles.severityLOW;
      case 'MEDIUM':
        return styles.severityMEDIUM;
      case 'HIGH':
        return styles.severityHIGH;
      case 'CRITICAL':
        return styles.severityCRITICAL;
      default:
        return styles.severityLOW;
    }
  };

  const navigateToReport = () => {
    setIsModalVisible(false);
    router.push('/Report');
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
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

        {/* Form Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>REPORT A CONCERN</Text>
          <Text style={styles.subtext}>
            Help us improve our barangay by reporting any issues or concerns you encounter.
            Select a category, describe the issue, and add a location or photo if possible.
            Our team will address it as soon as possible.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter subject line *"
            placeholderTextColor="#808080"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setCategory(value)}
              value={category}
              placeholder={{ label: 'Select a Category *', value: null }}
              items={[
                { label: 'Waste and Sanitation', value: 'waste' },
                { label: 'Health Concerns', value: 'health' },
                { label: 'Road and Traffic Issues', value: 'road' },
                { label: 'Environmental Concerns', value: 'environment' },
                { label: 'Public Safety', value: 'safety' },
                { label: 'Neighbor Concerns', value: 'neighbor' },
                { label: 'Community Services', value: 'services' },
                { label: 'Financial Assistance', value: 'finance' },
                { label: 'Other (Please Specify)', value: 'other' },
              ]}
              style={pickerStyles}
            />
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor="#808080"
            placeholder="Briefly explain your concern *"
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor="#808080"
            placeholder="Enter Address (Optional)"
            value={address}
            onChangeText={setAddress}
          />

<View style={styles.imageSection}>
  <Text style={styles.label}>Add an Image (Optional)</Text>
  {image ? (
    <View style={styles.imagePreviewContainer}>
      <Image source={{ uri: image }} style={styles.imagePreview} />
      <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
        <Ionicons name="close-circle" size={24} color="#EA3A57" />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.imageButtonsContainer}>
      <TouchableOpacity 
        style={[styles.imageButton, styles.cameraButton]} 
        onPress={() => pickImage(true)} // Open camera
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.imageButtonText}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.imageButton, styles.galleryButton]} 
        onPress={() => pickImage(false)} // Open gallery
      >
        <Ionicons name="image" size={24} color="white" />
        <Text style={styles.imageButtonText}>Choose from Gallery</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

          <Text style={styles.label}>Importance Level:</Text>
          <View style={styles.severityRow}>
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((level) => (
              <View key={level} style={styles.severityColumn}>
                <TouchableOpacity
                  style={[
                    styles.severityBtn, 
                    getSeverityStyle(level),
                    severity === level && styles.selectedSeverity
                  ]}
                  onPress={() => setSeverity(level)}
                >
                  <Text style={[
                    styles.severityText,
                    severity === level && styles.selectedSeverityText
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.severityDescription}>
                  {level === 'LOW' && 'Non-Urgent'}
                  {level === 'MEDIUM' && 'Moderate Urgency'}
                  {level === 'HIGH' && 'Immediate Attention\nNeeded'}
                  {level === 'CRITICAL' && 'Emergency'}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>REQUEST SUBMITTED</Text>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={styles.checkIcon} />
              <Text style={styles.modalMessage}>
                Your report has been successfully submitted. Our team will check and respond as soon as possible.
              </Text>

              <View style={styles.modalDivider} />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalButtonHalf}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>

                <View style={styles.verticalDivider} />

                <TouchableOpacity
                  style={styles.modalButtonHalf}
                  onPress={navigateToReport} 
                >
                  <Text style={styles.modalButtonText}>VIEW STATUS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Error/Alert Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isAlertVisible}
          onRequestClose={() => setIsAlertVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{alertTitle}</Text>
              <Ionicons 
                name={alertTitle === 'Submission Error' ? 'close-circle' : 'alert-circle'} 
                size={60} 
                color="#EA3A57" 
                style={styles.checkIcon} 
              />
              <Text style={styles.modalMessage}>
                {alertMessage}
              </Text>

              <View style={styles.modalDivider} />

              <TouchableOpacity
                style={[styles.modalButtonFull, { backgroundColor: '#EA3A57' }]}
                onPress={() => setIsAlertVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>UNDERSTOOD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const pickerStyles = {
  inputIOS: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  inputAndroid: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  topHalf: {
    backgroundColor: "#A7D477",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA3A57',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Poppins-Regular',
  },
  subtext: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Poppins-Regular',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  severityColumn: {
    alignItems: 'center',
    flex: 1,
  },
  severityBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    width: '95%',
  },
  selectedSeverity: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  selectedSeverityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  severityText: {
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  severityDescription: {
    fontSize: 8,
    color: '#000',
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  severityLOW: { backgroundColor: '#4CAF50' },
  severityMEDIUM: { backgroundColor: '#FFEB3B' },
  severityHIGH: { backgroundColor: '#FF9800' },
  severityCRITICAL: { backgroundColor: '#F44336' },
  submitBtn: {
    backgroundColor: '#EA3A57',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    marginHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA3A57',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  modalButton: {
    backgroundColor: '#EA3A57',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonHalf: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonFull: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#ccc',
  },
  checkIcon: {
    marginBottom: 10,
  },
  imageSection: {
    marginBottom: 15,
  },
  addImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EA3A57',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F5F5F5',
  },
  addImageText: {
    marginLeft: 10,
    color: '#EA3A57',
    fontFamily: 'Poppins-Regular',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  imageButtonsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
},
imageButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  padding: 12,
},
cameraButton: {
  backgroundColor: '#EA3A57',
},
galleryButton: {
  backgroundColor: '#4CAF50',
},
imageButtonText: {
  marginLeft: 10,
  color: 'white',
  fontFamily: 'Poppins-Regular',
},
});