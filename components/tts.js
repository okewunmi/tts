import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Pic from '../assets/images/profile.jpg'
import { Link, router } from "expo-router";
const Card = () => {
  const [playing, setPlaying] = useState(false);
  

  return (
      <View style={styles.box}>
    
      <TouchableOpacity style={styles.voice} 
        onPress={() => {router.push("/voices/selectVoice")}} 
        >
        <View style={styles.voiceImg}>
          <Image source={Pic} style={styles.Img}/>
        </View>
        <View><Text style={styles.voiceTxt}>Voices</Text></View>
    </TouchableOpacity>

<TouchableOpacity style={styles.voice} >
      <FontAwesome6 name="rotate-left" size={22} color="#9E9898" />
    </TouchableOpacity>


    <TouchableOpacity style={styles.voiceBtn}>
        {playing? <FontAwesome name="pause" size={29} color="white" />: <FontAwesome name="play" size={22} color="white" />}
    </TouchableOpacity>


<TouchableOpacity style={styles.voice} >
    <FontAwesome6 name="rotate-right" size={22} color="#9E9898" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.voice}>
       <View style={styles.voiceImg}><Text style={styles.voiceTxt}>10X</Text></View>
        <View><Text style={styles.voiceTxt}>Speed</Text></View>
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
    justifyContent: "space-evenly",
    alignItems: 'center',
    flexDirection: 'row'
  },
  voice: {
    justifyContent: "center",
    alignItems: 'center',
gap: 3
  },
  voiceImg:{
    borderRadius: 30,
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: '#9E9898',
    justifyContent: "center",
    alignItems: 'center',
  },
  Img:{
    borderRadius: 30,
    height: 34,
    width: 34,
  },
  voiceTxt: {
    fontWeight: '800',
    fontSize: 10,
    
  },
  voiceBtn:{
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 30,
    height: 55,
    width: 55,
    backgroundColor: '#3273F6',
  },
  
});
