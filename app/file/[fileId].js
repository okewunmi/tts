// import { StyleSheet, Text,  View,  ActivityIndicator, ScrollView } from "react-native";
// import React, { useEffect, useState}  from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { getDocumentById } from '../../lib/appwrite';


// const into = () => {
//   const { fileId } = useLocalSearchParams();
//   const router = useRouter();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fileUrl, setFileUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);

// useEffect(() => {
//     fetchDocument();
//   }, [fileId]);

//   const fetchDocument = async () => {
//     try {
//       const doc = await getDocumentById(fileId);
//       setDocument(doc);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load document');
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
  
//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView style={styles.scroll}>
//         <View style={styles.boxTxt}>
//           <Text style={styles.txt}> Transform Text into Speech with AI</Text>
//           <Text style={styles.headerTitle}>Document Details {fileId}</Text>
          
//         </View>
//       </ScrollView>
          
//         <View style={styles.bottom}></View>
//     </SafeAreaView>
//   );
// };

// export default into;

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#fff',
//     height: "100%",
//   },
//   scroll: {
//     flex: 1,
//     backgroundColor: '#eeee',
//     paddingHorizontal: 20,
//     marginTop: -25

//   },
//   boxTxt:{
//     width: '100%',

//   },
//   bottom: {
//     backgroundColor: '#fff',
//     width: '100%',
//     height: '90',
//     borderTopWidth: 1,
//     borderColor: "#f2f3f4",
//   }
// });



import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getDocumentById, getFilePreview } from "../../lib/appwrite";
import { WebView } from "react-native-webview";

const Into = () => {
  const { fileId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [fileId]);

  const fetchDocument = async () => {
    try {
      const doc = await getDocumentById(fileId);
      setDocument(doc);

      const url = await getFilePreview(fileId, "document"); // Assuming type is "document"
      setFileUrl(docpreview.fileUrl);
      setFileType(doc.fileType || "pdf"); // Fallback to PDF if fileType is not available
    } catch (error) {
      Alert.alert("Error", "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3273F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>
        <View style={styles.boxTxt}>
          <Text style={styles.txt}>Transform Text into Speech with AI</Text>
          <Text style={styles.headerTitle}>
            Document Details: {document?.title || "Untitled"}
          </Text>
        </View>
      </ScrollView>
      {fileUrl ? (
        <WebView
          source={{ uri: fileUrl }}
          style={{ flex: 1 }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3273F6" />
            </View>
          )}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to preview the file.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Into;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    backgroundColor: "#eeee",
    paddingHorizontal: 20,
    marginTop: -25,
  },
  boxTxt: {
    width: "100%",
  },
  txt: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 14,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
