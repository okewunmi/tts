import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
  FlatList
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from "expo-router";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Network from 'expo-network';

import {
  createDocument,
  uploadFile,
  getCurrentUser,
  createUrl,
  getAllUserContent,
  extractFileText,
  chunkedUploadFile,
  extractTextFromFile
} from "../../lib/appwrite";
import Card from "../../components/Card";
import CardTxt from "../../components/CardTxt";
import CardWeb from "../../components/CardWeb";
const home = () => {
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [txt, setTxt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [cachedDocuments, setCachedDocuments] = useState(null);

  const checkNetworkConnection = async () => {
    const netInfo = await Network.getNetworkStateAsync();
    return netInfo.isConnected && netInfo.isInternetReachable;
  };
  
  const renderItems = ({ item }) => {
    switch (item.docType) {
      case "Document":
        return <Card item={item} />;
      case "Text":
        return <CardTxt item={item} />;
      case "Web":
        return <CardWeb item={item} />;
      default:
        return null;
    }
  };

   // Load cached data on initial mount
   useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await AsyncStorage.getItem('documents');
        if (cached) {
          setCachedDocuments(JSON.parse(cached));
          setDocuments(JSON.parse(cached));
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };
    
    loadCachedData();
  }, []);


  // Load cached data on initial mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await AsyncStorage.getItem('documents');
        if (cached) {
          setCachedDocuments(JSON.parse(cached));
          setDocuments(JSON.parse(cached));
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };
    
    loadCachedData();
  }, []);

  // Initialize data and fetch user/documents
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const allContent = await getAllUserContent(currentUser.$id);
          setDocuments(allContent);
          // Cache the new data
          await AsyncStorage.setItem('documents', JSON.stringify(allContent));
        }
      } catch (error) {
        setError('Failed to load content');
        Alert.alert("Error", "Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchDocuments = async () => {
    setError(null);
    try {
      const allContent = await getAllUserContent(user.$id);
      setDocuments(allContent);
      await AsyncStorage.setItem('documents', JSON.stringify(allContent));
    } catch (error) {
      setError('Failed to fetch documents');
      Alert.alert("Error", "Failed to fetch documents");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  };

// const handleFileUpload = async () => {
//   try {
//     setIsSubmitting(true);
//     setUploading(true);

//     // Allowed file extensions
//     const allowedExtensions = ["pdf", "doc", "docx"];

//     // Show file picker
//     const result = await DocumentPicker.getDocumentAsync({
//       type: [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ],
//       copyToCacheDirectory: true,
//     });

//     if (!result.assets || result.assets.length === 0) {
//       console.log("No file selected");
//       return;
//     }

//     const file = result.assets[0];
//     console.log("Selected file:", file.name);
//     console.log("File MIME Type:", file?.mimeType);

//     // Extract file extension
//     const fileExtension = file.name.split(".").pop().toLowerCase();

//     // Validate file extension
//     if (!allowedExtensions.includes(fileExtension)) {
//       throw new Error(`File extension not allowed: .${fileExtension}`);
//     }

//     // Prepare file data for upload
//     const fileData = {
//       name: file.name,
//       uri: file.uri,
//       type: file.mimeType,
//       size: file.size,
//     };

//     // Upload file
//     const uploadedFile = await uploadFile(fileData);
//     console.log("Upload response:", uploadedFile);

//     if (!uploadedFile || !uploadedFile.fileUrl) {
//       throw new Error("File upload failed: No file URL returned");
//     }

//     console.log("Uploaded File URL:", uploadedFile.fileUrl);

//     // Create document record in Appwrite Database
//     await createDocument(file, user.$id, uploadedFile.fileUrl);

//     Alert.alert("Success", "Document uploaded successfully");

//     router.replace("/library");
//   } catch (error) {
//     console.error("Upload error:", error);
//     let errorMessage = "Document upload failed";

//     if (error.message.includes("File extension not allowed")) {
//       errorMessage = "This file type is not supported. Please upload a PDF, DOC, or DOCX file.";
//     } else if (error.message.includes("network request failed")) {
//       errorMessage = "Network issue. Please check your connection and try again.";
//     } else if (error.message.includes("timeout")) {
//       errorMessage = "Upload timed out. File might be too large.";
//     }

//     Alert.alert("Error", errorMessage);
//   } finally {
//     setUploading(false);
//     setIsSubmitting(false);
//   }
// };

const handleFileUpload = async () => {
  try {
    setIsSubmitting(true);
    setUploading(true);

    // Allowed file extensions
    const allowedExtensions = ["pdf", "doc", "docx"];

    // Show file picker
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });

    if (!result.assets || result.assets.length === 0) {
      console.log("No file selected");
      return;
    }

    const file = result.assets[0];
    console.log("Selected file:", file.name);
    console.log("File MIME Type:", file?.mimeType);

    // Extract file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Validate file extension
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`File extension not allowed: .${fileExtension}`);
    }

    // Prepare file data for upload
    const fileData = {
      name: file.name,
      uri: file.uri,
      type: file.mimeType,
      size: file.size,
    };

    // Upload and extract text in one operation
    console.log("Starting file upload and text extraction...");
    const { extractedText, fileUrl } = await extractTextFromFile(fileData);
    console.log("File uploaded and text extracted successfully");
    
    if (!fileUrl) {
      throw new Error("File upload failed: No file URL returned");
    }

    // Create document record in Appwrite Database with extracted text
    await createDocument(file, user.$id, fileUrl, extractedText);
    console.log("Document created with extracted text");

    Alert.alert("Success", "Document uploaded and text extracted successfully");

    router.replace("/library");
  } catch (error) {
    console.error("Upload error:", error);
    let errorMessage = "Document upload failed";

    if (error.message.includes("File extension not allowed")) {
      errorMessage = "This file type is not supported. Please upload a PDF, DOC, or DOCX file.";
    } else if (error.message.includes("network request failed")) {
      errorMessage = "Network issue. Please check your connection and try again.";
    } else if (error.message.includes("timeout")) {
      errorMessage = "Upload timed out. File might be too large.";
    } else if (error.message.includes("text extraction")) {
      errorMessage = "Failed to extract text: " + error.message;
    }

    Alert.alert("Error", errorMessage);
  } finally {
    setUploading(false);
    setIsSubmitting(false);
  }
};
  const handleUrl = async () => {
    // console.log("clicked!!");
    setShowModal(true);
  };

  // Handle Save
  const handleSave = async () => {
    if (!txt.trim()) {
      Alert.alert("Error", " No text to save.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createUrl(txt, user.$id);
      // setForm(result);
      Alert.alert("Success", "Text is save successfully!");
      router.replace("/library");
      return result;
    } catch (error) {
      Alert.alert("Saving text Failed", error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser(); // Verify this function's behavior
        // console.log("Current User:", currentUser); // Log for debugging
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUploading(false);
      }
    };
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Loading Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={uploading}
        onRequestClose={() => setUploading(false)}
      >
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#3273F6" />
        </View>
      </Modal>

      <View style={styles.top}>
        <View style={styles.Logo}>
          <MaterialCommunityIcons
            name="text-to-speech"
            size={20}
            color="#fff"
          />
        </View>
        <Text style={styles.head}>Voxify</Text>
        <TouchableOpacity>
          <SimpleLineIcons name="options-vertical" size={18} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.preview}>
        <View style={styles.txtBox}>
          <Text style={styles.heading}>Upgrade to Premium!</Text>
          <Text style={styles.txt}>To Enjoy all benefits</Text>
          <TouchableOpacity style={styles.upgrade}>
            <Text style={styles.upgradeTxt}>Upgrade</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.imgBox]}>
          <FontAwesome6
            name="crown"
            size={110}
            color="#f7b401"
            style={[styles.img, { transform: [{ rotate: "-12deg" }] }]}
          />
        </View>
      </View>
      <View style={styles.grid}>
        <View style={styles.box}>
          <TouchableOpacity
            style={[styles.box1, styles.red]}
            onPress={handleFileUpload}
          >
            <Ionicons
              name="document-text"
              size={24}
              color="white"
              style={styles.icon1}
            />
            <Text style={styles.iconTxt}>Import Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box1, styles.yellow]}
            onPress={() => {
              router.push("scan/scanPage");
            }}
          >
            <MaterialIcons
              name="document-scanner"
              size={24}
              color="white"
              style={styles.icon2}
            />
            <Text style={styles.iconTxt}>Scan Pages</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            style={[styles.box1, styles.green]}
            onPress={() => {
              router.push("type/typing");
            }}
          >
            <Entypo
              name="text-document"
              size={25}
              color="black"
              style={styles.icon3}
            />
            <Text style={styles.iconTxt}>Write or Paste Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box1, styles.blue]}
            onPress={handleUrl}
          >
            <MaterialCommunityIcons
              name="web"
              size={25}
              color="white"
              style={styles.icon4}
            />
            <Text style={styles.iconTxt}>Paste a Web Link</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.recent}>
        <View style={styles.recentBox}>
          <Text style={styles.recentTxt1}>Recent Documents</Text>
          <Link href={"/library"}>
            <View style={styles.viewAll}>
              <Text style={styles.recentTxt2}>View All</Text>
              <AntDesign name="arrowright" size={23} color="#5dade2" />
            </View>
          </Link>
        </View>
       
        <View style={styles.recentDoc}>
        <FlatList
          data={documents.slice(0, 3)}
          renderItem={renderItems}
          keyExtractor={(item) => item.$id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>
      </View>
      {showModal ? (
        <Modal
          transparent={true}
          visible={showModal}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          >
            <View style={styles.modalContent}>
              {/* Stop propagation prevents the modal from closing when clicking inside */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Paste a Web Link</Text>
                </View>

                {/* Add your additional modal content here */}
                <View style={styles.modalBody}>
                  <TextInput
                    editable
                    placeholder="e.g. www.apple.com"
                    style={styles.modalInput}
                    value={txt}
                    onChangeText={setTxt}
                  />
                </View>
                <View style={styles.modalBtn}>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={[styles.Btn, styles.btn1]}
                  >
                    <View>
                      <Text style={styles.btnTxt1}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.Btn, styles.btn2]}
                  >
                    <View>
                      <Text style={styles.btnTxt2}>
                        {isSubmitting ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          "Save"
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  safe: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    // height: 20,
    alignItems: "center",
  },
  upgrade: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "55%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  upgradeTxt: {
    fontSize: 11,
    fontWeight: "bold",
  },
  head: {
    fontSize: 20,
    fontWeight: "700",
  },
  Logo: {
    backgroundColor: "#3273F6",
    borderRadius: 100,
    padding: 5,
  },
  preview: {
    borderRadius: 10,
    width: "100%",
    height: 110,
    backgroundColor: "#3273F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  txtBox: {
    justifyContent: "center",
    // width: '5%',
    height: "100%",
    gap: 6,
  },
  heading: {
    fontWeight: "900",
    fontSize: 16,
    color: "#fff",
  },
  txt: {
    fontSize: 13,
    color: "#dedede",
  },
  imgBox: {
    // width: '50%',
    position: "absolute",
    top: -20,
    right: 10,
  },
  img: {},
  grid: {
    height: 210,
    gap: 10,
    marginVertical: 20,
    marginHorizontal: 8,
  },
  box: {
    flexDirection: "row",
    width: "100%",
    height: "50%",
    gap: 10,
  },
  box1: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 5,
  },
  red: {
    backgroundColor: "#fdedec",
  },
  yellow: {
    backgroundColor: "#fef9e7",
  },
  green: {
    backgroundColor: "#e9f7ef",
  },
  blue: {
    backgroundColor: "#ebf5fb",
  },
  iconTxt: {
    fontWeight: "bold",
    fontSize: 12,
  },
  icon1: {
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 100,
  },
  icon2: {
    padding: 10,
    backgroundColor: "#d4ac0d",
    borderRadius: 100,
  },
  icon3: {
    padding: 10,
    backgroundColor: "#7dcea0",
    borderRadius: 100,
  },
  icon4: {
    padding: 10,
    backgroundColor: "#3273F6",
    borderRadius: 100,
  },
  recent: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  recentBox: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    // marginVertical: 9,
    paddingTop: 5
  },
  recentTxt1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recentTxt2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5dade2",
    paddingLeft: 20,
  },
  viewAll: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
    height: "auto",
    paddingTop: 10
  },
  recentDoc: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 3,
    
  },
  Doc: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#f2f3f4",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  docImg: {
    height: 50,
    width: 40,
    borderWidth: 1,
    borderColor: "#b2babb",
    marginRight: 5,
  },
  docTxt: {
    flexDirection: "column",
    gap: 4,
  },
  docTxtHead: {
    fontSize: 14,
    fontWeight: "bold",
    paddingRight: 10,
  },
  docTxtdate: {
    flexDirection: "row",
    gap: 20,
  },
  docTxtSmall: {
    fontSize: 12,
    color: "grey",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    // maxWidth: 400,
    marginBottom: 2,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#cecece",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalBody: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#cecece",
  },
  modalInput: {
    backgroundColor: "#cecece",
    borderRadius: 10,
    padding: 15,
    // marginVertical: 5,
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  Btn: {
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: "#cecece",
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  btn1: {
    backgroundColor: "#ebf5fb",
  },
  btn2: {
    backgroundColor: "#3273F6",
  },
  btnTxt1: {
    color: "#3273F6",
    fontSize: 14,
  },
  btnTxt2: {
    color: "#fff",
    fontSize: 14,
  },
  modalText: {
    fontSize: 16,
  },
});
