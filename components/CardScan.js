import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {  useRouter} from "expo-router";

const CardScan = ({ item }) => {
  const { link, createdAt, $id, docType } = item
  const router = useRouter();

// Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
const formatTitle = (link) => {
    if (!link) return 'Untitled';
    return link.length > 20 ? `${link.slice(0, 27)}...` : link;
  };
  return (
    <TouchableOpacity
      style={styles.Doc}
      onPress={() => {
        if (item.$id) {
          router.push(`/imgScan/${item.$id}`);
        } else {
          console.warn('Document ID is missing');
        }
      }}
    >
      <View style={styles.docImgBox}>
       
        <View style={styles.docImg}>
            <AntDesign name="scan1" size={25}  color="#3273F6"/>
          </View>
      <View style={styles.docTxt}>
        <Text style={styles.docTxtHead}>{formatTitle(link)}</Text>
        <View style={styles.docTxtdate}>
          <Text style={styles.docTxtSmall}>{formatDate(createdAt ||"Dec 20, 2024")}</Text>
            <Text style={styles.docTxtSmall}>{ docType}</Text>
        </View>
        </View>
      </View>
      <TouchableOpacity>
        <SimpleLineIcons name="options-vertical" size={18} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default CardScan;

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
    fontSize: 12,
    fontWeight: "500",
    paddingRight: 10,
  },
  docTxtdate: {
    flexDirection: "row",
    gap: 20,
  },
  docTxtSmall: {
    fontSize: 11,
    color: "grey",
  },
});



























































