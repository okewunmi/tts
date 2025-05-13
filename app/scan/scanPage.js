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


// // const CameraPreview = () => {
// import React, { useState, useRef, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as ImagePicker from "expo-image-picker";
// import { router } from "expo-router";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { useGlobalContext } from "../../context/GlobalProvider";

// const CameraPreview = () => {
//   const cameraRef = useRef(null);
//   const [scanning, setScanning] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
//   const { addImage, images } = useGlobalContext();

//   useEffect(() => {
//     (async () => {
//       const libPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       setHasMediaLibraryPermission(libPermission.status === "granted");
//     })();
//   }, []);

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', textAlign: 'center', marginBottom: 10 }}>
//           We need camera permission to continue
//         </Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const handleCapture = async () => {
//     if (cameraRef.current) {
//       try {
//         setScanning(true);
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.8,
//           skipProcessing: true,
//         });
//         addImage(photo.uri);
//       } catch (error) {
//         Alert.alert("Error", "Failed to take picture: " + error.message);
//       } finally {
//         setScanning(false);
//       }
//     }
//   };

//   const pickFromLibrary = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaType,
//         allowsMultipleSelection: true,
//         quality: 0.8,
//         selectionLimit: 10,
//       });

//       if (!result.canceled && result.assets) {
//         result.assets.forEach((asset) => addImage(asset.uri));
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick images: " + error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       />

//       <View style={styles.bottomControls}>
//         <TouchableOpacity
//           style={styles.controlButton}
//           onPress={pickFromLibrary}
//         >
//           <FontAwesome name="photo" size={26} color="white" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.captureButton}
//           onPress={handleCapture}
//           disabled={scanning}
//         >
//           {scanning ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <View style={styles.captureButtonInner} />
//           )}
//         </TouchableOpacity>

//         {images.length > 0 && (
//           <TouchableOpacity
//             style={styles.previewContainer}
//             onPress={() => router.push("scan/preview")}
//           >
//             <Image
//               source={{ uri: images[0] }}
//               style={styles.previewImage}
//               resizeMode="cover"
//             />
//             {images.length > 1 && (
//               <View style={styles.imageCountBadge}>
//                 <Text style={styles.imageCountText}>{images.length}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   bottomControls: {
//     position: 'absolute',
//     bottom: 30,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 30,
//   },
//   controlButton: {
//     padding: 15,
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//   },
//   previewContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 10,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//   },
//   imageCountBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageCountText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   permissionButton: {
//     backgroundColor: '#0066cc',
//     padding: 15,
//     borderRadius: 8,
//     alignSelf: 'center',
//   },
// });

// export default CameraPreview;

import React, { useState, useRef, useEffect } from "react";
import { createWorker } from 'tesseract.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGlobalContext } from "../../context/GlobalProvider";
// import MlkitOcr from 'react-native-mlkit-ocr';
import { createScanDoc, getCurrentUser } from "../../lib/appwrite";
import * as MlkitOcr from 'react-native-mlkit-ocr';
const ScanScreen = () => {
  // Camera and permissions state
  const cameraRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

  // Preview state
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const { images, addImage, clearImages } = useGlobalContext();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    (async () => {
      const libPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasMediaLibraryPermission(libPermission.status === "granted");

      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data");
      }
    })();
  }, []);

  // Navigation functions for preview
  const goPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goNext = () => {
    if (currentIndex < images.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  // Camera functions
  const handleCapture = async () => {
    
    if (cameraRef.current) {
      try {
        setScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        addImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture: " + error.message);
      } finally {
        setScanning(false);
      }
    }
  };

  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => addImage(asset.uri));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images: " + error.message);
    }
  };

  
 // OCR Processing


// OCR Processing with Tesseract.js
const handleContinue = async () => {
  if (!user) {
    Alert.alert("Error", "User not authenticated.");
    return;
  }

  try {
    setLoading(true);

    // 1. Validate all image URIs
    const validImages = images.filter(uri => {
      if (!uri || (!uri.startsWith('file://') && !uri.startsWith('content://'))) {
        console.warn('Invalid image URI:', uri);
        return false;
      }
      return true;
    });

    if (validImages.length === 0) {
      Alert.alert("Error", "No valid images found");
      return;
    }

    // 2. Create Tesseract worker
    const worker = await createWorker({
      logger: m => console.log(m), // Optional progress logger
      errorHandler: err => console.error(err) // Error handler
    });

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // 3. Process each image
      const processingResults = await Promise.all(
        validImages.map(async (uri) => {
          try {
            console.log(`Processing image from: ${uri}`);
            
            // Convert Android content URIs if needed
            const processedUri = Platform.OS === 'android' && uri.startsWith('content://') 
              ? await convertContentUriToFileUri(uri) 
              : uri;

            // Verify the image exists before processing
            const fileExists = await FileSystem.getInfoAsync(processedUri);
            if (!fileExists.exists) {
              throw new Error("Image file not found");
            }

            // Perform OCR with timeout fallback
            const result = await Promise.race([
              worker.recognize(processedUri),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error("OCR timeout (15s)")), 15000)
              )
            ]);

            console.log('OCR raw result:', result.data.text);

            if (!result.data.text || result.data.text.trim() === '') {
              throw new Error("No text detected in image");
            }

            const extractedText = result.data.text;
            const doc = await createScanDoc(user.$id, processedUri, extractedText);

            return {
              success: true,
              uri: processedUri,
              extractedText,
              docId: doc.$id,
              confidence: result.data.confidence
            };
          } catch (error) {
            console.error(`Failed to process image ${uri}:`, {
              error: error.message,
              stack: error.stack,
              uri: uri
            });
            return {
              success: false,
              uri,
              error: error.message,
              rawError: error
            };
          }
        })
      );

      // 4. Analyze results
      const successfulScans = processingResults.filter(r => r.success);
      const failedScans = processingResults.filter(r => !r.success);

      if (successfulScans.length > 0) {
        let message = `Successfully extracted text from ${successfulScans.length} image(s)`;
        
        if (failedScans.length > 0) {
          message += `\n\nFailed to process ${failedScans.length} image(s):\n`;
          message += failedScans.map((f, i) => 
            `${i+1}. ${f.uri.split('/').pop()}: ${f.error}`
          ).join('\n');
        }

        Alert.alert("Scan Complete", message);
      } else {
        const errorDetails = failedScans.map(f => 
          `• ${f.uri.split('/').pop()}: ${f.error}`
        ).join('\n');
        
        Alert.alert(
          "Scan Failed",
          `Couldn't extract text from any images:\n\n${errorDetails}\n\nPossible solutions:\n- Use higher quality images\n- Ensure text is clear and horizontal\n- Try better lighting`
        );
      }
    } finally {
      // Always terminate worker
      await worker.terminate();
    }
  } catch (error) {
    console.error("Overall scan error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    Alert.alert(
      "Processing Error",
      `An unexpected error occurred: ${error.message || 'Unknown error'}`
    );
  } finally {
    setLoading(false);
  }
};

// Android Content URI to File URI converter (unchanged)
const convertContentUriToFileUri = async (contentUri) => {
  try {
    // For Expo projects
    if (MediaLibrary) {
      const asset = await MediaLibrary.createAssetAsync(contentUri);
      return asset.uri;
    }
    
    // For bare React Native
    const fileInfo = await FileSystem.getInfoAsync(contentUri);
    if (fileInfo.exists) return contentUri;

    // Fallback: Try to copy the file
    const newPath = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: contentUri, to: newPath });
    return newPath;
  } catch (error) {
    console.error("URI conversion failed:", error);
    return contentUri; // Fallback to original URI
  }
};

  const handleCancel = () => {
    clearImages();
    setShowPreview(false);
  };

  // Permission handling
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 10 }}>
          We need camera permission to continue
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      {!showPreview ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          />

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={pickFromLibrary}
            >
              <FontAwesome name="photo" size={26} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            {images.length > 0 && (
              <TouchableOpacity
                style={styles.previewContainer}
                onPress={() => setShowPreview(true)}
              >
                <Image
                  source={{ uri: images[0] }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                {images.length > 1 && (
                  <View style={styles.imageCountBadge}>
                    <Text style={styles.imageCountText}>{images.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <>
          {images.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No images to preview</Text>
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
                )}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewConfigRef.current}
                getItemLayout={getItemLayout}
              />

              <View style={styles.controls}>
                <TouchableOpacity onPress={goPrev} disabled={currentIndex === 0}>
                  <FontAwesome
                    name="chevron-left"
                    size={24}
                    color={currentIndex === 0 ? '#ccc' : '#000'}
                  />
                </TouchableOpacity>

                <Text style={styles.counter}>
                  {currentIndex + 1} / {images.length}
                </Text>

                <TouchableOpacity onPress={goNext} disabled={currentIndex === images.length - 1}>
                  <FontAwesome
                    name="chevron-right"
                    size={24}
                    color={currentIndex === images.length - 1 ? '#ccc' : '#000'}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.continueButton]}
              onPress={handleContinue}
              disabled={loading || images.length === 0}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    padding: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  previewContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageCountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  image: {
    width: Dimensions.get('window').width,
    height: '80%',
    backgroundColor: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  counter: {
    marginHorizontal: 20,
    fontSize: 16,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  continueButton: {
    backgroundColor: '#0066cc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanScreen;