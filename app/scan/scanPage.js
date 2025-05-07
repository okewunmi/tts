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

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CameraPreview = () => {
  
  const [scanning, setScanning] = useState(false);
  const [uploadingToServer, setUploadingToServer] = useState(false);

  
  

  const handleCapture = async () => {
    
  };

  return (
    <View style={styles.container}>

      <View style={styles.bottom}></View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
   justifyContent: 'flex-end'
  },
  bottom:{
    height: 100,
    backgroundColor: 'rgb(5, 5, 5)',
    borderColor: '#ececec',
    borderTopWidth: 2
  
  },
  camera: {
    flex: 1,
  
  },
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '95%',
    height: '100%',
  },
  scanFrame: {
    // width: '95%',
    // height: '100%',
    // borderWidth: 2,
    // borderColor: '#FFFFFF',
    // borderRadius: 10,
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
    backgroundColor: 'rgb(0, 0, 0)',
    zIndex:9,
     borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:500
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