import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";

const DATA = [
  {
    id: "1",
    title: "All",
  },
  {
    id: "2",
    title: "Documents",
  },
  {
    id: "3",
    title: "Scan",
  },
  {
    id: "4",
    title: "Text",
  },
  {
    id: "5",
    title: "Web URL",
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.scrollBtn, { backgroundColor }]}
  >
    <Text style={[styles.scrollTxt, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);
const library = () => {
  const [selectedId, setSelectedId] = useState();

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#3273F6" : "#fff";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View style={styles.Logo}>
          <MaterialCommunityIcons
            name="text-to-speech"
            size={20}
            color="#fff"
          />
        </View>
        <Text style={styles.head}>Library</Text>
        <TouchableOpacity>
          <Feather name="search" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.topBtn}>
        <TouchableOpacity style={[styles.btn, styles.btnBlue]}>
          <Text style={[styles.btnTxt, styles.btnTxt1]}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGrey]}>
          <Text style={[styles.btnTxt, styles.btnTxt2]}>Favourites</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.scroll}
        horizontal
        data={DATA}
        renderItem={renderItem}
        extraData={selectedId}
        showsHorizontalScrollIndicator={false} // Hides the scroll thumb
      />
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
};

export default library;

const styles = StyleSheet.create({
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
    alignItems: "center",
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
  topBtn: {
    marginVertical: 20,
    width: "100%",
    flexDirection: "row",
    height: 40,
  },
  btn: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 6,
  },
  btnBlue: {
    backgroundColor: "#3273F6",
  },
  btnGrey: {
    backgroundColor: "#dedede",
  },
  btnTxt: {
    textAlign: "center",
    fontWeight: "black",
  },
  btnTxt1: {
    color: "#fff",
  },
  btnTxt2: {
    color: "#000",
  },
  scroll: {
    maxHeight: 50,
  },
  scrollBtn: {
    paddingVertical: 8,
    paddingHorizontal: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dedede",
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  scrollTxt: {
    fontSize: 13,
    color: "#000",
    height: "100%",
    fontWeight: "bold",
    height: "100%",
  },
});
