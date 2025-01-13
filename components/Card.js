import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {router} from 'expo-router'
import Img from "../assets/images/home.png";
const Card = ({ item }) => {
    const {title,createdAt}=item

// Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  


  return (
    <TouchableOpacity
      style={styles.Doc}
      onPress={() => {
        router.push(`/Read/${item.$id}`);
      }}
    >
      <View style={styles.docImgBox}>
      <Image source={Img} style={styles.docImg} />
      <View style={styles.docTxt}>
        <Text style={styles.docTxtHead}>{title.length > 20 ? title.slice(0, 23).concat(' ...'): title }</Text>
        <View style={styles.docTxtdate}>
          <Text style={styles.docTxtSmall}>{formatDate(createdAt ||"Dec 20, 2024")}</Text>
          <Text style={styles.docTxtSmall}>Document</Text>
        </View>
      </View>
</View>
      <TouchableOpacity>
        <SimpleLineIcons name="options-vertical" size={18} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Card;

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
    marginBottom: 5
  },
  docImgBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: "center",
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
