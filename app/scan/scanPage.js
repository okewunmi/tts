import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { scanPhoto, getCurrentUser } from '../../lib/appwrite';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera';
import MlkitOcr from 'react-native-mlkit-ocr';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CameraPreview = () => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [uploadingToServer, setUploadingToServer] = useState(false);

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const processImage = async (uri) => {
    try {
      // Process with MLKit OCR
      const result = await MlkitOcr.detectFromUri(uri);
  
      // Extract text from OCR result
      return result.map((block) => block.text).join("\n").trim();
    } catch (error) {
      console.error("OCR Error:", error);
      throw new Error("Failed to extract text from image");
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || scanning) return;

    try {
      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });
  
      if (!photo?.uri) {
        throw new Error("Failed to capture image");
      }
  
      // Extract text from the captured image
      const extractedText = await processImage(photo.uri);
  
      // Upload extracted text to server
      await scanPhoto(photo.uri, extractedText);
  
      Alert.alert("Success", "Text has been extracted and saved successfully!", [
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to process image", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        // type={CameraType.back}
        // facing={CameraType.back}
        ratio="4:3"
      >
        {/* Overlay for better document alignment */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>

        {/* Scanning indicator */}
        {scanning && (
          <View style={styles.scanningOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.scanningText}>
              {uploadingToServer ? 'Uploading...' : 'Extracting text...'}
            </Text>
          </View>
        )}

        {/* Capture button */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[
              styles.captureButton,
              scanning && styles.captureButtonDisabled
            ]}
            onPress={handleCapture}
            disabled={scanning}
          >
            <View style={styles.innerCircle}>
              {scanning ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <MaterialIcons name="camera" size={24} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3273F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CameraPreview;