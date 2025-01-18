import { StyleSheet, Text, TouchableOpacity, View, Image,  ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState}  from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDocumentById } from '../../lib/appwrite';

const into = () => {
  const { fileId } = useLocalSearchParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    fetchDocument();
  }, [fileId]);

  const fetchDocument = async () => {
    try {
      const doc = await getDocumentById(fileId);
      setDocument(doc);
    } catch (error) {
      Alert.alert('Error', 'Failed to load document');
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
          <Text style={styles.txt}> Transform Text into Speech with AI</Text>
          <Text style={styles.headerTitle}>Document Details {document?.title}</Text>
          
        </View>
      </ScrollView>
          
        <View style={styles.bottom}></View>
    </SafeAreaView>
  );
};

export default into;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    height: "100%",
  },
  scroll: {
    flex: 1,
    backgroundColor: '#eeee',
    paddingHorizontal: 20,
    marginTop: -25

  },
  boxTxt:{
    width: '100%',

  },
  bottom: {
    backgroundColor: '#fff',
    width: '100%',
    height: '90',
    borderTopWidth: 1,
    borderColor: "#f2f3f4",
  }
});
