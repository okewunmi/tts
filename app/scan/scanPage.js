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

import FontAwesome from "@expo/vector-icons/FontAwesome";
const CameraPreview = () => {

  const [scanning, setScanning] = useState(false);
  const [uploadingToServer, setUploadingToServer] = useState(false);




  const handleCapture = async () => {

  };

  return (
    <View style={styles.container}>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.select}>
         <FontAwesome name="photo" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.snap}>
          <View style={styles.small}></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.BoxPick}>
        
        <View style={styles.pick}>
          
        </View>
        <View style={styles.number}></View>
        <View ><Text style={styles.PickTxt}>Continue</Text></View>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  bottom: {
    height: 110,
    backgroundColor: 'rgb(8, 7, 7)',
    // borderColor: '#ececec',
    // borderTopWidth: 2,
    
    flexDirection: 'row',
    paddingHorizontal: 50,
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'space-between',
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
  },
  BoxPick:{
    alignItems: 'center',
    justifyContent: 'center',
    gap:3,
  },
  number:{
    position: 'absolute',
    top: -1,
    right: -9,
    backgroundColor: 'red',
    height: 25,
    width: 25,
    borderRadius: 100,
    backgroundColor: '#3273F6'
  },
  pick: {
    height: 50,
    width: 50,
    backgroundColor: '#FFF',
    borderRadius: 100,
  },
  select: {
    height: 60,
    width: 60,
    backgroundColor: 'rgb(87, 87, 87)',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'flex-start'
  },
  PickTxt:{
    color: "#FFF",
    fontSize: 10,
    fontWeight: 'bold'
  },
  snap: {
    height:60,
    width: 60,
    // backgroundColor: '#FFF',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'

  },
  small: {
    height: 46,
    width: 46,
    backgroundColor: '#FFF',
    borderRadius: 100,

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
    zIndex: 9,
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
    zIndex: 500
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