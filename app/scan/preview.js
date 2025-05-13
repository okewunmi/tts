// import React, { useState, useRef } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Platform,
// } from 'react-native';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

// const Preview = () => {
//   const [uploadingToServer, setUploadingToServer] = useState(false);

//   const handleCapture = async () => {};

//   return (
//     <View style={styles.container}>
//       <View style={styles.paginate}>
//         <TouchableOpacity>
//           <FontAwesome name="arrow-left" size={22} color="black" />
//         </TouchableOpacity>

//         <View style={styles.paginateNum}>
//           <Text> image 1 of 6</Text>
//         </View>
//         <TouchableOpacity>
//           <FontAwesome name="arrow-right" size={22} color="black" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.bottom}>
//         <TouchableOpacity style={styles.btn}>
//           <View>
//             <Text style={styles.txt}>Continue</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   bottom: {
//     height: 110,
//     backgroundColor: 'rgb(8, 7, 7)',
//     flexDirection: 'row',
//     paddingHorizontal: 50,
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'center',
//   },
//   btn: {
//     backgroundColor: '#3273F6',
//     paddingVertical: 13,
//     paddingHorizontal: 70,
//     borderRadius: 60,
//   },
//   txt: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   paginate: {
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'center',
//     gap: 20,
//     flexDirection: 'row',
//   },
//   paginateNum: {
//     paddingVertical: 2,
//     paddingHorizontal: 15,
//     backgroundColor: '#cecece',
//     borderRadius: 20,
//   },
// });

// export default Preview;

// Preview.js
// import React, { useRef, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   Dimensions,
// } from 'react-native';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { useGlobalContext } from '../../context/GlobalProvider';

// const Preview = () => {
//   const { images } = useGlobalContext();
//   const flatListRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const screenWidth = Dimensions.get('window').width;

//   const goPrev = () => {
//     if (currentIndex > 0) {
//       flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const goNext = () => {
//     if (currentIndex < images.length - 1) {
//       flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       setCurrentIndex(viewableItems[0].index);
//     }
//   });
//   const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

//   const getItemLayout = (data, index) => ({
//     length: screenWidth,
//     offset: screenWidth * index,
//     index,
//   });

//   if (!images || images.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No images to preview</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ref={flatListRef}
//         data={images}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <Image source={{ uri: item }} style={[styles.image, { width: screenWidth }]} />
//         )}
//         keyExtractor={(item, index) => index.toString()}
//         onViewableItemsChanged={onViewableItemsChanged.current}
//         viewabilityConfig={viewConfigRef.current}
//         getItemLayout={getItemLayout}
//       />

//       <View style={styles.paginate}>
//         <TouchableOpacity onPress={goPrev} disabled={currentIndex === 0}>
//           <FontAwesome name="arrow-left" size={22} color={currentIndex === 0 ? "#999" : "#fff"} />
//         </TouchableOpacity>

//         <View style={styles.paginateNum}>
//           <Text>{`image ${currentIndex + 1} of ${images.length}`}</Text>
//         </View>

//         <TouchableOpacity onPress={goNext} disabled={currentIndex === images.length - 1}>
//           <FontAwesome name="arrow-right" size={22} color={currentIndex === images.length - 1 ? "#999" : "#fff"} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bottom}>
//         <TouchableOpacity style={styles.btn}>
//           <Text style={styles.txt}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Preview;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'flex-end',
//   },
//   image: {
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   emptyContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   paginate: {
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'center',
//     gap: 20,
//     flexDirection: 'row',
//     // backgroundColor: '#fff',
//   },
//   paginateNum: {
//     paddingVertical: 2,
//     paddingHorizontal: 15,
//     backgroundColor: '#cecece',
//     borderRadius: 20,
//   },
//   bottom: {
//     height: 110,
//     backgroundColor: 'rgb(8, 7, 7)',
//     flexDirection: 'row',
//     paddingHorizontal: 50,
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'center',
//   },
//   btn: {
//     backgroundColor: '#3273F6',
//     paddingVertical: 13,
//     paddingHorizontal: 70,
//     borderRadius: 60,
//   },
//   txt: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
// });



import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGlobalContext } from '../../context/GlobalProvider';
import { scanImages } from "../../lib/appwrite";
import { getCurrentUser } from "../../lib/appwrite";
import { router } from 'expo-router';


const Preview = () => {
  const { images, clearImages } = useGlobalContext();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const screenWidth = Dimensions.get('window').width;

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

  useEffect(() => {
    const initializeData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data");
      }
    };

    initializeData();
  }, []);

  // const handleContinue = async () => {
  //   if (!user) {
  //     Alert.alert("Error", "User not authenticated.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Check for required permissions first
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert(
  //         "Permission Required",
  //         "Please enable photo library access to scan images."
  //       );
  //       return;
  //     }

  //     // Process the images
  //     const { success, data, individualResults, stats } = await scanImages({
  //       imageUris: images,
  //       userId: user.$id
  //     });

  //     clearImages();

  //     // Analyze results
  //     const successfulScans = individualResults.filter((r) => r.success);
  //     const failedScans = individualResults.filter((r) => !r.success);

  //     if (successfulScans.length > 0) {
  //       let message = `Successfully extracted text from ${successfulScans.length} image(s)`;

  //       // Add details about failed scans if any
  //       if (failedScans.length > 0) {
  //         message += `\n\nFailed to process ${failedScans.length} image(s):`;
  //         failedScans.forEach((scan, index) => {
  //           message += `\n${index + 1}. ${scan.error || 'Unknown error'}`;
  //         });
  //       }

  //       Alert.alert("Scan Complete");
  //     } else {
  //       Alert.alert(
  //         "Scan Failed",
  //         "No text could be extracted from the images. Please try with clearer images."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Scan error:", error);
  //     Alert.alert(
  //       "Error",
  //       error.message || "An error occurred during text extraction.",

  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleContinue = async () => {
  if (!user) {
    Alert.alert("Error", "User not authenticated.");
    return;
  }

  try {
    setLoading(true);
    Alert.alert("Processing", "Starting OCR processing...");

    // 1. Validate and prepare images
    const validImages = await Promise.all(
      images.map(async (uri) => {
        try {
          const { filePath, exists } = await verifyAndPrepareImage(uri);
          return exists ? { uri, filePath } : null;
        } catch (error) {
          console.warn(`Invalid image ${uri}:`, error);
          return null;
        }
      })
    ).then(results => results.filter(Boolean));

    if (validImages.length === 0) {
      Alert.alert("Error", "No valid images available for processing");
      return;
    }

    // 2. Process images with progress feedback
    const processingResults = [];
    let processedCount = 0;

    for (const { uri, filePath } of validImages) {
      try {
        processedCount++;
        Alert.alert("Processing", `Processing image ${processedCount} of ${validImages.length}`);

        const result = await processImageWithFallback(filePath);
        const doc = await createScanDoc(user.$id, uri, result.text);

        processingResults.push({
          success: true,
          uri,
          extractedText: result.text,
          confidence: result.confidence,
          method: result.method
        });
      } catch (error) {
        console.error(`Failed to process ${uri}:`, error);
        processingResults.push({
          success: false,
          uri,
          error: error.message
        });
      }
    }

    // 3. Display comprehensive results
    showResults(processingResults);

  } catch (error) {
    console.error("Fatal processing error:", error);
    Alert.alert("Critical Error", `Processing failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

// ========== Helper Functions ========== //

async function verifyAndPrepareImage(uri) {
  if (!uri) throw new Error("Missing image URI");

  // Handle Android content URIs
  let filePath = Platform.OS === 'android' && uri.startsWith('content://')
    ? await handleContentUri(uri)
    : uri;

  // Verify file existence
  const fileInfo = await FileSystem.stat(filePath).catch(() => null);
  if (!fileInfo || !fileInfo.isFile()) {
    throw new Error("File not found or inaccessible");
  }

  return { filePath, exists: true };
}

async function handleContentUri(contentUri) {
  try {
    // Try direct access first
    const fileInfo = await FileSystem.stat(contentUri);
    if (fileInfo.isFile()) return contentUri;

    // Fallback to copy
    const destPath = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
    await FileSystem.copyFile(contentUri, destPath);
    return destPath;
  } catch (error) {
    console.error("Content URI handling failed:", error);
    throw new Error("Failed to process Android content URI");
  }
}

async function processImageWithFallback(filePath) {
  try {
    // First try ML Kit
    try {
      const mlResult = await TextRecognition.recognize(filePath);
      return {
        text: mlResult.text,
        confidence: calculateMLConfidence(mlResult.blocks),
        method: 'ML Kit'
      };
    } catch (mlError) {
      console.warn("ML Kit failed, trying Tesseract:", mlError);
    }

    // Fallback to Tesseract
    const base64Data = await FileSystem.readFile(filePath, 'base64');
    const tesseractResult = await Tesseract.recognize(
      `data:image/jpeg;base64,${base64Data}`,
      'eng',
      {
        logger: m => console.log(m),
        tessedit_pageseg_mode: 6,
        tessedit_ocr_engine_mode: 1
      }
    );

    return {
      text: tesseractResult.data.text,
      confidence: tesseractResult.data.confidence,
      method: 'Tesseract'
    };
  } catch (error) {
    console.error("Both OCR methods failed:", error);
    throw new Error("All OCR methods failed for this image");
  }
}

function calculateMLConfidence(blocks = []) {
  if (blocks.length === 0) return 0;
  const validBlocks = blocks.filter(b => b.confidence != null);
  if (validBlocks.length === 0) return 0;
  return validBlocks.reduce((sum, b) => sum + b.confidence, 0) / validBlocks.length;
}

function showResults(results) {
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;

  if (successCount === 0) {
    Alert.alert("Scan Failed", "Couldn't extract text from any images");
    return;
  }

  let message = `Successfully processed ${successCount} image(s)\n`;
  if (failCount > 0) {
    message += `\nFailed to process ${failCount} image(s)\n`;
  }

  const methodsUsed = results
    .filter(r => r.success)
    .reduce((acc, { method }) => {
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

  message += "\nMethods used:\n" +
    Object.entries(methodsUsed)
      .map(([method, count]) => `• ${method}: ${count}`)
      .join("\n");

  Alert.alert("Scan Complete", message);
}

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No images to preview</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.scanButtonText}>Process Images</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  image: {
    width: Dimensions.get('window').width,
    height: '80%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  counter: {
    marginHorizontal: 20,
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Preview;
