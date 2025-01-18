import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const profile = () => {
  return (
    <SafeAreaView style={styles.safe} >
      <View>
      <Text>library</Text>
    </View>
    </SafeAreaView>
    
  );
};

export default profile;

const styles = StyleSheet.create({
safe: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#ffff",
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
});
