import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getWebtById, getFilePreview } from "../../lib/appwrite";
// import TTSFuction from '..components/tts'
import { WebView } from 'react-native-webview';


const FileView = () => {
  const { urlId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [urlId]);

  const fetchDocument = async () => {
    try {
      const doc = await getWebtById(urlId);
      setDocument(doc);
      
      // Extract file ID from the fileUrl
      // const storedFileId = doc.fileUrl.split('/').pop();
      // // Get preview URL
      // const previewUrl = await getFilePreview(storedFileId);
      // setPdfUrl(previewUrl);
    } catch (error) {
      console.error('Error loading document:', error);
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

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No document found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
      <WebView
        source={{ uri: 'https://www.example.com' }} // Replace with your desired URL
        style={styles.webview}
      />
    </View>
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  
});

export default FileView;