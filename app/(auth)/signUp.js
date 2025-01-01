import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import EvilIcons from '@expo/vector-icons/EvilIcons';

const signUp = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.view}>
        <Text style={styles.heading}>Join Voxify Today </Text>
        <Text style={styles.txt}>
          Sign up to unlock the full power of Voxify{" "}
        </Text>
      </View>

      <View style={styles.inputBox}>
        <View style={styles.Box}>
          <Text style={styles.label}>Email </Text>
          <TouchableOpacity style={styles.touchInput}>
            <Fontisto name="email" size={22} color="black" />
            <TextInput placeholder="Email" style={styles.input} />
          </TouchableOpacity>
        </View>
        <View style={styles.Box}>
          <Text style={styles.label}>Password </Text>
          <TouchableOpacity style={styles.touchInput}>
            <EvilIcons name="lock" size={24} color="black" />
            <TextInput placeholder="Password" style={styles.input} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default signUp;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 22,
  },
  view: {
    justifyContent: "flex-start",
    width: "100%",
  },
  heading: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "left",
  },
  txt: {
    fontSize: 15,
    marginTop: 12,
    color: "grey",
  },
  inputBox: {
    marginTop: 40,
    gap: 22,
  },
  Box: {
   gap: 6
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  touchInput: {
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ecf0f1 ",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  input: {
    height: '100%'
  }
});
