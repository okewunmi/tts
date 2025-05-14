// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLocalSearchParams } from "expo-router";
// import { getDocumentById } from "../../lib/appwrite";
//  import TTSFunction from "../../components/Tts";


// const FileView = () => {
//   const { fileId } = useLocalSearchParams();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDocument();
//   }, [fileId]);

//   const fetchDocument = async () => {
//     try {
//       const doc = await getDocumentById(fileId);
//       setDocument(doc);
//     } catch (error) {
//       console.error("Error loading document:", error);
//       Alert.alert("Error", "Failed to load document");
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
//         <Text>No document found</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView style={styles.scroll}>
//         <View style={styles.boxTxt}>
//           <Text style={styles.headerTitle}>
//             {document?.title || "Untitled"}
//           </Text>
//         </View>

//         <View>
//           {/* <Text style={styles.headerTitle}>
//             {document?.createdAt || "null"}
//           </Text> */}
//           <Text style={styles.txt}>{document?.extractedText}</Text>
//         </View>
//       </ScrollView>
//       <TTSFunction text={document?.extractedText || "Untitled"} />
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
//     padding: 20,
//     marginTop: -25.2,
//   },
//   boxTxt: {},
//   headerTitle:{
//     textAlign: 'justify',
//     lineHeight: 25,
//     fontSize: 16,
//     fontWeight: '700'
//   },
//   txt:{
//     textAlign: 'justify',
//     lineHeight: 30,
//     fontSize: 14,
//     fontWeight: '500',
 
//       },
// });

// export default FileView;

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getDocumentById } from "../../lib/appwrite";
import TTSFunction from "../../components/Tts";

const createChunks = (text, maxWords = 30) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
};

const FileView = () => {
  const { fileId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollViewRef = useRef(null);
  const chunkRefs = useRef([]);

  useEffect(() => {
    fetchDocument();
  }, [fileId]);

  const fetchDocument = async () => {
    try {
      const doc = await getDocumentById(fileId);
      setDocument(doc);
    } catch (error) {
      console.error("Error loading document:", error);
      Alert.alert("Error", "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const handleChunkChange = (index) => {
    setActiveIndex(index);
    if (chunkRefs.current[index]) {
      chunkRefs.current[index].measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({ y: y - 60, animated: true });
        },
        (error) => console.error("measureLayout error:", error)
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3273F6" />
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No document found</Text>
      </View>
    );
  }

  const chunks = createChunks(document?.extractedText || "");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView ref={scrollViewRef} style={styles.scroll}>
        <View style={styles.boxTxt}>
          <Text style={styles.headerTitle}>
            {document?.title || "Untitled"}
          </Text>
        </View>

        <View>
          {chunks.map((chunk, index) => (
            <Text
              key={index}
              ref={(ref) => (chunkRefs.current[index] = ref)}
              style={[
                styles.txt,
                index === activeIndex && styles.activeChunk,
              ]}
            >
              {chunk}
            </Text>
          ))}
        </View>
      </ScrollView>
      <TTSFunction
        text={document?.extractedText || ""}
        onChunkChange={handleChunkChange}
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
    padding: 20,
    marginTop: -25.2,
  },
  boxTxt: {},
  headerTitle: {
    textAlign: "justify",
    lineHeight: 25,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  txt: {
    textAlign: "justify",
    lineHeight: 30,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  activeChunk: {
    backgroundColor: "#d0e6ff",
    padding: 2,
  
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FileView;
