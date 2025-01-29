// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   ScrollView,
//    Dimensions,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLocalSearchParams } from "expo-router";
// import { getWebById } from "../../lib/appwrite";
// // import TTSFuction from '..components/tts'
// import { WebView } from "react-native-webview";

// const FileView = () => {
//   const { urlId } = useLocalSearchParams();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDocument();
//   }, [urlId]);

//   const fetchDocument = async () => {
//     try {
//       const doc = await getWebById(urlId);
//       setDocument(doc);
//     } catch (error) {
//       console.error("Error loading document:", error);
//       Alert.alert("Error", "Failed to load url");
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
//         <View style={styles.container}>
//           {/* <WebView
//             source={{ uri: document.link }}
//             style={styles.webview}
//           /> */}
//           <Text style={styles.headerTitle}>{document?.link}</Text>
//         </View>
//       </ScrollView>
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
// });

// export default FileView;

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getWebById } from "../../lib/appwrite";
import { WebView } from "react-native-webview";

const { height } = Dimensions.get("window");

const FileView = () => {
  const { urlId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [urlId]);

  const fetchDocument = async () => {
    try {
      const doc = await getWebById(urlId);
      setDocument(doc);
    } catch (error) {
      console.error("Error loading document:", error);
      Alert.alert("Error", "Failed to load URL");
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

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No URL found</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      {webViewError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load the webpage. Please check the URL.
          </Text>
        </View>
      ) : (
        <WebView
          source={{ uri: document.link }}
          style={styles.webview}
          onError={() => setWebViewError(true)}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3273F6" />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
    height: height - 100, // Adjust based on your header height
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
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default FileView;