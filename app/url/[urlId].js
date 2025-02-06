import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getWebById } from "../../lib/appwrite";
import { WebView } from "react-native-webview";
import TTSFuction from "../../components/Tts";
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
      <TTSFuction />
    </View>
  );
};

export default FileView;

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
