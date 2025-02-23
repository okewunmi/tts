
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Pic from "../assets/images/profile.jpg";
import * as Speech from "expo-speech";
import { router } from "expo-router";

const Card = ({ text, onBoundary }) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.8);

  // const getAvailableVoices = async () => {
  //   const voices = await Speech.getAvailableVoicesAsync();
  //   console.log("Available voices:", voices);
  // };
  // useEffect(() => {
  //   getAvailableVoices();
  // }, []);

  const speak = () => {
    if (!text) return;
    if (playing) {
      Speech.stop();
      setPlaying(false);
    } else {
      Speech.speak(text, {
        language: "en-US",
        rate: speed,
        pitch: 1.1,
        onBoundary: onBoundary,
        voice: "com.apple.ttsbundle.Samantha-compact",
        onDone: () => setPlaying(false),
        onStopped: () => setPlaying(false),
      });
      setPlaying(true);
    }
  };

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => (prevSpeed < 2.0 ? prevSpeed + 0.25 : 1.0));
  };

  useEffect(() => {
    return () => {
      Speech.stop(); // Stop speech when the component unmounts
      setPlaying(false);
    };
  }, []);

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.voice} onPress={() => router.push("/voices/selectVoice")}>
        <View style={styles.voiceImg}>
          <Image source={Pic} style={styles.Img} />
        </View>
        <Text style={styles.voiceTxt}>Voices</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice}>
        <FontAwesome6 name="rotate-left" size={22} color="#9E9898" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.voiceBtn} onPress={speak}>
        {playing ? (
          <FontAwesome name="pause" size={29} color="white" />
        ) : (
          <FontAwesome name="play" size={22} color="white" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice}>
        <FontAwesome6 name="rotate-right" size={22} color="#9E9898" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice} onPress={increaseSpeed}>
        <View style={styles.voiceImg}>
          <Text style={styles.voiceTxt}>{speed.toFixed(2)}x</Text>
        </View>
        <Text style={styles.voiceTxt}>Speed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Card;


const styles = StyleSheet.create({
  box: {
    height: 100,
    backgroundColor: "#fff",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  voice: {
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  voiceImg: {
    borderRadius: 30,
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: "#9E9898",
    justifyContent: "center",
    alignItems: "center",
  },
  Img: {
    borderRadius: 30,
    height: 34,
    width: 34,
  },
  voiceTxt: {
    fontWeight: "800",
    fontSize: 10,
  },
  voiceBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 55,
    width: 55,
    backgroundColor: "#3273F6",
  },
});
