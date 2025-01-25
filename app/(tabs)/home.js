import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
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
import { Link, router } from "expo-router";

import * as DocumentPicker from "expo-document-picker";
import * Filesystem from 'expo-file-system';
import pdfParse form 'pdf-parse';
import mammoth from 'mammoth';
import { createDocument, uploadFile, getCurrentUser } from "../../lib/appwrite";

const home = () => {
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    });

      if (!result.canceled) {
        const file = result.assets[0];

        try {
          // Upload file to storage and get URL
          const fileUrl = await uploadFile(file, "document");
          setUploading(true);
          if (fileUrl) {
            // Create document record
            await createDocument(file, user.$id, fileUrl);
            Alert.alert("Success", "Document uploaded successfully");
            router.replace("/library");
          }
        } catch (error) {
          Alert.alert("Error", error.message || "Error uploading document");
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Error picking document");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
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
          <TouchableOpacity style={[styles.box1, styles.yellow]}>
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
          <TouchableOpacity style={[styles.box1, styles.green]}>
            <Entypo
              name="text-document"
              size={25}
              color="black"
              style={styles.icon3}
            />
            <Text style={styles.iconTxt}>Write or Paste Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.box1, styles.blue]}>
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
        <View style={styles.recentDoc}></View>
      </View>
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
});
