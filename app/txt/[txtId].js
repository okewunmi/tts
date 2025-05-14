// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState, useRef } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLocalSearchParams } from "expo-router";
// import { getTextById } from "../../lib/appwrite";
// import TTSFuction from '../../components/Tts'


// const FileView = () => {
//   const { txtId } = useLocalSearchParams();
//   const [document, setDocument] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeChunkIndex, setActiveChunkIndex] = useState(0);
// const scrollViewRef = useRef(null);
// const chunkRefs = useRef([]);


//   const createChunks = (text) => {
//     const words = text.split(' ');
//     const chunks = [];
//     let currentChunk = '';

//     for (const word of words) {
//       if ((currentChunk + word).length < 200) {
//         currentChunk += `${word} `;
//       } else {
//         chunks.push(currentChunk.trim());
//         currentChunk = `${word} `;
//       }
//     }

//     if (currentChunk) {
//       chunks.push(currentChunk.trim());
//     }

//     return chunks;
//   };

// const chunks = createChunks(document?.text || '');

// useEffect(() => {
//   if (chunkRefs.current[activeChunkIndex]) {
//     chunkRefs.current[activeChunkIndex].measureLayout(
//       scrollViewRef.current,
//       (x, y) => {
//         scrollViewRef.current.scrollTo({ y: y - 50, animated: true });
//       },
//       () => {}
//     );
//   }
// }, [activeChunkIndex]);


//   useEffect(() => {
//     fetchDocument();
//   }, [txtId]);

//   const fetchDocument = async () => {
//     try {
//       if (!txtId) {
//         setError('No text ID provided');
//         setLoading(false);
//         return;
//       }

//       console.log('Attempting to fetch text:', txtId); // Debug log
//       const doc = await getTextById(txtId);
//       setDocument(doc);
//       setError(null);

//     } catch (error) {
//       console.error('Error loading text:', error);
//       Alert.alert("Error", "Failed to text");
//       setError(null);
//       setDocument(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3273F6" />
//       </View>
//     );
//   }

//   if (!document) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>No url found</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView style={styles.scroll}>
//         {/* <View style={styles.boxTxt}>
//           <Text style={styles.txt}>
//             {document?.text || 'Untitled'}
//           </Text>
//         </View> */}
//         <View style={styles.boxTxt}>
//           <Text style={styles.txt}>
//             {createChunks(document?.text || '').map((chunk, index) => (
//               <Text
//                 key={index}
//                 style={index === activeChunkIndex ? styles.highlightedText : {}}
//               >
//                 {chunk + ' '}
//               </Text>
//             ))}
//           </Text>
//         </View>

//       </ScrollView>
//       {/* <TTSFuction text={document?.text || "Untitled"}  /> */}
//       <TTSFuction
//         text={document?.text || "Untitled"}
//         onChunkIndexChange={setActiveChunkIndex}
//       />
//     </SafeAreaView>
//   );
// };



// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scroll: {
//     flex: 1,
//     backgroundColor: "#eeee",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginTop: -25.2
//   },
//   txt: {
//     textAlign: 'justify',
//     lineHeight: 25,
//     fontSize: 15,
//     fontWeight: '500'
//   },
//   highlightedText: {
//     color: "red",
//     textDecorationLine: "underline",
//   },

// });

// export default FileView;

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getTextById } from "../../lib/appwrite";
import TTSFunction from "../../components/Tts";

const CHUNK_SIZE = 200;

const createChunks = (text) => {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + word).length < CHUNK_SIZE) {
      currentChunk += `${word} `;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = `${word} `;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

const FileView = () => {
  const { txtId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);
  const chunkRefs = useRef([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchDocument();
  }, [txtId]);

  const fetchDocument = async () => {
    try {
      if (!txtId) return;
      const doc = await getTextById(txtId);
      setDocument(doc);
    } catch (error) {
      console.error("Error loading text:", error);
    }
  };

  useEffect(() => {
  if (currentChunkIndex >= 0 && chunkRefs.current[currentChunkIndex]) {
    chunkRefs.current[currentChunkIndex].measureLayout(
      scrollViewRef.current,
      (x, y) => {
        scrollViewRef.current.scrollTo({ y: y - 50, animated: true });
      }
    );
  }
}, [currentChunkIndex]);

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3273F6" />
      </View>
    );
  }

  const chunks = createChunks(document.text || "");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView ref={scrollViewRef} style={styles.scroll}>
        <View style={styles.boxTxt}>
          {chunks.map((chunk, index) => (
            <Text
              key={index}
              ref={(el) => (chunkRefs.current[index] = el)}
              style={[
                styles.txt,
                index === currentChunkIndex && styles.highlightedText,
              ]}
            >
              {chunk + " "}
            </Text>
          ))}
        </View>
      </ScrollView>
      <TTSFunction
        text={document?.text || "Untitled"}
         onChunkChange={setCurrentChunkIndex}
        
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#eeee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: -25.2,
  },
  txt: {
    textAlign: "justify",
    lineHeight: 25,
    fontSize: 15,
    fontWeight: "500",
  },
  highlightedText: {
    backgroundColor: "#d0e6ff",
    borderRadius: 6,
    padding: 4,
    fontWeight: "bold",
  },
});

export default FileView;
