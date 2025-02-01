// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//     Text,
//     View,
//   Button,
//   TouchableOpacity,
// } from "react-native";
// import { scanPhoto, getCurrentUser } from '../../lib/appwrite';
// import { CameraView, Camera, useCameraPermissions  } from 'expo-camera';
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// const CameraPreview = () => {
//     const cameraRef = useRef(null);
//     const [permission, requestPermission] = useCameraPermissions();
//     const [uploading, setUploading] = useState(false);
//   const [user, setUser] = useState(null);
  
    
//     if (!permission?.granted) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text>Camera permission required</Text>
//         <Button title="Grant Permission" onPress={requestPermission} />
//       </View>
//     );
//   }
// const handleScan = async () => {
//     if (!cameraRef.current) return;
    
//     try {
//       const result = await scanPhoto(getCurrentUser.$id);
//         Alert.alert("Success", "Text extracted and saved!");
//         return result;
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     }
//   };
    
    
//   return (
//     <CameraView
//       ref={cameraRef}
//       style={StyleSheet.absoluteFill}
//       facing="back"
//       mode="picture"
//     >
//       {/* <TouchableOpacity  
//         onPress={handleScan}
//       > */}
//         <View style={styles.scanButtonContainer}>
//         <Button 
//           title="Scan Document" 
//           onPress={() => handleScan} 
//         />
//       </View>
        
//       {/* </TouchableOpacity> */}
//     </CameraView>
//   );
// };
// export default CameraPreview

// const styles = StyleSheet.create({
    
// })

import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

const CameraPreviews = () => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const linePosition = new Animated.Value(0);

  useEffect(() => {
    if (scanning) {
      startAnimation();
    }
  }, [scanning]);

  const startAnimation = () => {
    linePosition.setValue(0);
    Animated.loop(
      Animated.timing(linePosition, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleScan = async () => {
    if (!permission?.granted) {
      await requestPermission();
      return;
    }

    if (cameraRef.current) {
      setScanning(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const result = await scanPhoto(photo.uri);
        Alert.alert("Success", "Text extracted and saved!");
        return result;
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setScanning(false);
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const translateY = linePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        mode="picture"
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
                  <View style={styles.captureButtonBox}>
                 
          {/* <TouchableOpacity 
            style={styles.captureButton}
            onPress={handleScan}
            disabled={scanning}
          >
            <View style={styles.innerCircle}>
              {scanning && <View style={styles.scanningIndicator} />}
            </View>
            </TouchableOpacity> */}
            </View>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraPreviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  scanLine: {
    height: 2,
    backgroundColor: '#00ff00',
    width: '100%',
    position: 'absolute',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#00ff00',
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#00ff00',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#00ff00',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#00ff00',
  },
  captureButton: {
    // position: 'absolute',
    //  bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    },
  //   captureButtonBox: {
  //     width: '100%',
  //   height: 100,
  //       backgroundColor: '#000',
  //     position: 'absolute',
  //     bottom: 0,
  // },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

