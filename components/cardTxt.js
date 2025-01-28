import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import Img from "../assets/images/home.png";

const CardTxt = ({ item }) => {
  const { text, createdAt, $id, docType } = item;
  const router = useRouter();

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTitle = (text) => {
    if (!text) return "Untitled";
    return text.length > 20 ? `${text.slice(0, 27)}...` : text;
  };
  return (
    <TouchableOpacity
      style={styles.Doc}
      onPress={() => {
        console.log("txt ID:", $id); // Debug log
        if (!item.$id) {
          console.warn("Text ID is missing");
          return;
        }
        router.push(`/txt/${item.$id}`);
        
      }}
    >
      <View style={styles.docImgBox}>
        {/* <Image source={Img} style={styles.docImg} /> */}
        <View style={styles.docImg}>
          <Feather
          name="file-text"
          size={26}
          color="#3273F6"
          
        />
        </View>
        
        <View style={styles.docTxt}>
          <Text style={styles.docTxtHead}>{formatTitle(text)}</Text>
          <View style={styles.docTxtdate}>
            <Text style={styles.docTxtSmall}>
              {formatDate(createdAt || "Dec 20, 2024")}
            </Text>
            <Text style={styles.docTxtSmall}>{docType}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <SimpleLineIcons name="options-vertical" size={18} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default CardTxt;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
  },
  Doc: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#f2f3f4",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 5,
  },
  docImgBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  docImg: {
    height: 48,
    width: 48,
    borderWidth: 1,
    marginRight: 5,
    borderColor: "#dedede",
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200
  },
  docTxt: {
    flexDirection: "column",
    gap: 4,
  },
  docTxtHead: {
    fontSize: 14,
    fontWeight: "500",
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
