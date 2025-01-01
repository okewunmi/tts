import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'

const signIn = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View>
      <Text>signIn</Text>
    </View>
    </SafeAreaView>
    
  )
}

export default signIn

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
})