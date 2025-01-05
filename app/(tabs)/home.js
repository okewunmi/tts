import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
const home = () => {
  return(
    <SafeAreaView style={styles.safe}>
      <View>
      <Text>home</Text>
    </View>
      </SafeAreaView>
    
  )
}

export default home

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#fff"
  },
})