import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";

const into = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.view} >
        <View style={styles.curve}></View>
        <View style={styles.box}>
          <View style={styles.boxTxt}>
            <Text style={styles.txt}>Transform Text into Speech with AI</Text>
             <Text style={styles.para}>Welcome to Voxify, the Ai-powered app that brign your text to life. Convert any texts to high-quality in a few taps. </Text>
          </View>
        
        </View>
      </View>
    </SafeAreaView>
  )
}

export default into

const styles = StyleSheet.create({
  safe:{
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: '100%',
    
  },
  view:{
    backgroundColor: '#fff',
    height: '50%',
    width: '100%',
    position: "absolute",
    bottom: 0,
    left: 0,
    
  },
  
  curve: {
    width: '100%',
    height: 120,
    backgroundColor: '#3273F6',
    marginTop: -65,
    borderRadius: '100%'
  },
  box: {
    padding: 20,
    justifyContent: 'center',
     alignItems: 'center',
  },
  boxTxt: { 
    width: '90%',
    
  },
  txt: {
    textAlign: 'center',
    fontSize: 27,
    lineHeight: 40,
    fontWeight: '700'
  }
})