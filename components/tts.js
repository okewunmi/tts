import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const Card = () => {
 
  return (
      <View style={styles.box}>
      
      <TouchableOpacity style={styles.voice}>
        <View><Text style={styles.voiceTxt}>Voices</Text></View>
    </TouchableOpacity>
      </View>
    
  );
};

export default Card;

const styles = StyleSheet.create({
  box: {
    height: 100,
    backgroundColor: "#fff",
    width: '100%',
    justifyContent: "center",
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'grey'
  },
  voice: {
    boderRadius: 30,
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: 'red'

  },
  voiceTxt: {
    fontWeight: 'bold',
    fontSize: 13,
    
  }
  
});
