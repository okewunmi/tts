// import React, { useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Platform,
// } from "react-native";
// import { Link, router } from "expo-router";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// const CameraPreview = () => {

//   const [scanning, setScanning] = useState(false);
//   const [uploadingToServer, setUploadingToServer] = useState(false);




//   const handleCapture = async () => {

//   };

//   return (
//     <View style={styles.container}>

//       <View style={styles.bottom}>
//         <TouchableOpacity style={styles.select}>
//           <FontAwesome name="photo" size={26} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.snap}>
//           <View style={styles.small}></View>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.BoxPick}
//           onPress={() => {
//             router.push("scan/preview");
//           }}
//         >

//           <View style={styles.pick}>

//           </View>
//           <View style={styles.number} ><Text style={styles.num}>2</Text></View>
//           <View ><Text style={styles.PickTxt}>Continue</Text></View>
//         </TouchableOpacity>
//       </View>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end'
//   },
//   bottom: {
//     height: 110,
//     backgroundColor: 'rgb(8, 7, 7)',
//     flexDirection: 'row',
//     paddingHorizontal: 50,
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'space-between',

//   },
//   BoxPick: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 3,
//   },
//   number: {
//     position: 'absolute',
//     top: -1,
//     right: -7,
//     backgroundColor: 'red',
//     height: 23,
//     width: 23,
//     borderRadius: 100,
//     backgroundColor: '#3273F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   num:{
// color: '#ffff',

//   },
//   pick: {
//     height: 50,
//     width: 50,
//     backgroundColor: '#FFF',
//     borderRadius: 100,
//   },
//   select: {
//     height: 60,
//     width: 60,
//     backgroundColor: 'rgb(87, 87, 87)',
//     borderRadius: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//     // alignSelf: 'flex-start'
//   },
//   PickTxt: {
//     color: "#FFF",
//     fontSize: 10,
//     fontWeight: 'bold'
//   },
//   snap: {
//     height: 80,
//     width: 80,
//     borderRadius: 100,
//     borderWidth: 4,
//     borderColor: '#FFF',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   small: {
//     height: 60,
//     width: 60,
//     backgroundColor: '#FFF',
//     borderRadius: 100,
//   },

// });

// export default CameraPreview;

// CameraPreview.js
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGlobalContext } from "../../context/GlobalProvider";

const CameraPreview = () => {
  const cameraRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [uploadingToServer, setUploadingToServer] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

  const { addImage, images } = useGlobalContext();

  // Request media library permission once
  useEffect(() => {
    (async () => {
      const libPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasMediaLibraryPermission(libPermission.status === "granted");
    })();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 10 }}>
          We need camera permission to continue
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.select}>
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        setScanning(true);
        const photo = await cameraRef.current.takePictureAsync();
        addImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
      } finally {
        setScanning(false);
      }
    }
  };

  const pickFromLibrary = async () => {
    if (hasMediaLibraryPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true, // only works on web and iOS
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map((asset) => asset.uri);
        uris.forEach((uri) => addImage(uri));
      }
    } else {
      Alert.alert("Permission required", "Please enable media library access.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.select} onPress={pickFromLibrary}>
          <FontAwesome name="photo" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.snap} onPress={handleCapture}>
          {scanning ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.small} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.BoxPick}
          onPress={() => router.push("scan/preview")}
        >
          <View style={styles.pick} />
          <View style={styles.number}>
            <Text style={styles.num}>{images.length}</Text>
          </View>
          <Text style={styles.PickTxt}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'black',
  },
  bottom: {
    height: 110,
    backgroundColor: 'rgb(8, 7, 7)',
    flexDirection: 'row',
    paddingHorizontal: 50,
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  BoxPick: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  number: {
    position: 'absolute',
    top: -1,
    right: -7,
    height: 23,
    width: 23,
    borderRadius: 100,
    backgroundColor: '#3273F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
  PickTxt: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: 'bold',
  },
  snap: {
    height: 80,
    width: 80,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    height: 60,
    width: 60,
    backgroundColor: '#FFF',
    borderRadius: 100,
  },
});

export default CameraPreview;

