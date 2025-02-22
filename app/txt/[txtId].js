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
import { getTextById } from "../../lib/appwrite";
 import TTSFuction from '../../components/Tts'


const FileView = () => {
  const { txtId} = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchDocument();
  }, [txtId]);

  const fetchDocument = async () => {
    try {
      if (!txtId) {
        setError('No text ID provided');
        setLoading(false);
        return;
      }

      console.log('Attempting to fetch text:', txtId); // Debug log
      const doc = await getTextById(txtId);
      setDocument(doc);
      setError(null);
    
    } catch (error) {
      console.error('Error loading text:', error);
      Alert.alert("Error", "Failed to text");
      setError(null);
       setDocument(null);
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
        <Text>No url found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>
        <View style={styles.boxTxt}>
          <Text style={styles.txt}>
            {document?.text || 'Untitled'}
          </Text>
        </View>
      </ScrollView>
      <TTSFuction text={document?.text || "Untitled"}  />
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
    marginTop: -25.2
  },
  txt:{
textAlign: 'justify',
lineHeight: 25,
fontSize: 15,
fontWeight: '500'
  },
  highlightedText: {
    color: "red",
    textDecorationLine: "underline",
  },
  
});

export default FileView;