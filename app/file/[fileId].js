import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getDocumentById } from "../../lib/appwrite";
 import TTSFuction from "../../components/Tts";

const FileView = () => {
  const { fileId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [fileId]);

  const fetchDocument = async () => {
    try {
      const doc = await getDocumentById(fileId);
      setDocument(doc);

      // Extract file ID from the fileUrl
      // const storedFileId = doc.fileUrl.split('/').pop();
      // Get preview URL
      // const previewUrl = await getFilePreview(storedFileId);
      // setPdfUrl(previewUrl);
    } catch (error) {
      console.error("Error loading document:", error);
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
        <View style={styles.boxTxt}>
          <Text style={styles.headerTitle}>
            {document?.title || "Untitled"}
          </Text>
        </View>

        <View>
          {/* <Text style={styles.headerTitle}>
            {document?.createdAt || "null"}
          </Text> */}
          <Text style={styles.headerTitle}>{document?.extractedText}</Text>
        </View>
      </ScrollView>
      <TTSFuction />
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
});

export default FileView;
