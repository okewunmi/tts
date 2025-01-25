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
import { getDocumentById, getFilePreview } from "../../lib/appwrite";


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
      const storedFileId = doc.fileUrl.split('/').pop();
      // Get preview URL
      const previewUrl = await getFilePreview(storedFileId);
      setPdfUrl(previewUrl);
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

  if (!document || !pdfUrl) {
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
            {document?.title}
          </Text>
        </View>
        <View style={styles.container}>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FileView;

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 100,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  boxTxt: {
    width: "100%",
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  }
});