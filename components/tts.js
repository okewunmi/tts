
// import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
// import React, { useState, useEffect } from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import Pic from "../assets/images/profile.jpg";
// import * as Speech from "expo-speech";
// import { router } from "expo-router";

// const Card = ({ text, onBoundary }) => {
//   const [playing, setPlaying] = useState(false);
//   const [speed, setSpeed] = useState(0.8);

//   // const getAvailableVoices = async () => {
//   //   const voices = await Speech.getAvailableVoicesAsync();
//   //   console.log("Available voices:", voices);
//   // };
//   // useEffect(() => {
//   //   getAvailableVoices();
//   // }, []);
//   useEffect(() => {
//     Speech.speak("", { rate: 0.8 });
//   }, []);

  
//   const speak = async () => {
//     if (!text) return;
//     if (playing) {
//       Speech.stop();
//       setPlaying(false);
//     } else {
//       await Speech.stop(); 
//       setTimeout(() => {
//         setPlaying(true);
//         Speech.speak(text, {
//           language: "en-US",
//           rate: speed,
//           pitch: 1.1,
//           onBoundary: onBoundary,
//           onDone: () => setPlaying(false),
//           onStopped: () => setPlaying(false),
//         });
//       }, 100); // Small delay to ensure stop is completed
//     }
//   };
  

//   const increaseSpeed = () => {
//     setSpeed((prevSpeed) => (prevSpeed < 2.0 ? prevSpeed + 0.25 : 1.0));
//   };

//   useEffect(() => {
//     return () => {
//       Speech.stop(); // Stop speech when the component unmounts
//       setPlaying(false);
//     };
//   }, []);

//   return (
//     <View style={styles.box}>
//       <TouchableOpacity style={styles.voice} onPress={() => router.push("/voices/selectVoice")}>
//         <View style={styles.voiceImg}>
//           <Image source={Pic} style={styles.Img} />
//         </View>
//         <Text style={styles.voiceTxt}>Voices</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.voice}>
//         <FontAwesome6 name="rotate-left" size={22} color="#9E9898" />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.voiceBtn} onPress={speak}>
//         {playing ? (
//           <FontAwesome name="pause" size={29} color="white" />
//         ) : (
//           <FontAwesome name="play" size={22} color="white" />
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.voice}>
//         <FontAwesome6 name="rotate-right" size={22} color="#9E9898" />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.voice} onPress={increaseSpeed}>
//         <View style={styles.voiceImg}>
//           <Text style={styles.voiceTxt}>{speed.toFixed(2)}x</Text>
//         </View>
//         <Text style={styles.voiceTxt}>Speed</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Card;


// const styles = StyleSheet.create({
//   box: {
//     height: 100,
//     backgroundColor: "#fff",
//     width: "100%",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   voice: {
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 3,
//   },
//   voiceImg: {
//     borderRadius: 30,
//     height: 40,
//     width: 40,
//     borderWidth: 1,
//     borderColor: "#9E9898",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   Img: {
//     borderRadius: 30,
//     height: 34,
//     width: 34,
//   },
//   voiceTxt: {
//     fontWeight: "800",
//     fontSize: 10,
//   },
//   voiceBtn: {
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 30,
//     height: 55,
//     width: 55,
//     backgroundColor: "#3273F6",
//   },
// });

import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Pic from "../assets/images/profile.jpg";
import * as Speech from "expo-speech";
import { router } from "expo-router";

const TTSFunction = ({ text, onBoundary }) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.8);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [textChunks, setTextChunks] = useState([]);
  const MAX_CHUNK_SIZE = 3000; // Safe limit for most devices

  // Split text into manageable chunks on component mount or when text changes
  useEffect(() => {
    if (!text) {
      setTextChunks([]);
      return;
    }
    
    // Split by sentences to avoid cutting in the middle of speech
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = "";
    
    sentences.forEach(sentence => {
      // If adding this sentence would exceed the chunk size, start a new chunk
      if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    });
    
    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    setTextChunks(chunks);
    setCurrentChunk(0);
    console.log(`Text split into ${chunks.length} chunks`);
  }, [text]);

  useEffect(() => {
    // Just perform a simple initialization
    try {
      // Simple initialization (not a real speak, just to initialize the engine)
      Speech.speak("", { 
        rate: speed,
        onError: (error) => console.log("Speech initialization error:", error)
      });
    } catch (error) {
      console.log("Error in speech initialization:", error);
    }
    
    // Cleanup when component unmounts
    return () => {
      Speech.stop();
      setPlaying(false);
    };
  }, []);

  const speakCurrentChunk = async () => {
    if (textChunks.length === 0 || currentChunk >= textChunks.length) return;
    
    try {
      console.log(`Speaking chunk ${currentChunk + 1} of ${textChunks.length}`);
      Speech.speak(textChunks[currentChunk], {
        language: "en-US",
        rate: speed,
        pitch: 1.1,
        onBoundary: onBoundary,
        onDone: handleChunkFinished,
        onStopped: () => setPlaying(false),
        onError: (error) => {
          console.log("Speech error:", error);
          setPlaying(false);
        }
      });
    } catch (error) {
      console.log("Error in speech:", error);
      setPlaying(false);
    }
  };
  
  const handleChunkFinished = () => {
    if (currentChunk < textChunks.length - 1) {
      // More chunks to speak
      console.log(`Chunk ${currentChunk + 1} finished, moving to next chunk`);
      setCurrentChunk(prev => prev + 1);
      // Small delay before starting the next chunk
      setTimeout(() => {
        speakCurrentChunk();
      }, 300);
    } else {
      // All chunks finished
      console.log("All chunks finished");
      setPlaying(false);
      setCurrentChunk(0);
    }
  };

  const speak = async () => {
    if (textChunks.length === 0) {
      console.log("No text to speak");
      return;
    }
    
    if (playing) {
      console.log("Stopping speech");
      Speech.stop();
      setPlaying(false);
    } else {
      console.log("Starting speech");
      await Speech.stop();
      setPlaying(true);
      setTimeout(() => {
        speakCurrentChunk();
      }, 100);
    }
  };

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => {
      const newSpeed = prevSpeed < 2.0 ? prevSpeed + 0.25 : 1.0;
      console.log(`Speed changed to ${newSpeed.toFixed(2)}x`);
      return newSpeed;
    });
  };

  const restart = () => {
    console.log("Restarting speech from beginning");
    Speech.stop();
    setCurrentChunk(0);
    setTimeout(() => {
      if (playing) {
        speakCurrentChunk();
      }
    }, 100);
  };

  const skipForward = () => {
    if (currentChunk < textChunks.length - 1) {
      console.log("Skipping to next chunk");
      Speech.stop();
      setCurrentChunk(prev => prev + 1);
      if (playing) {
        setTimeout(() => {
          speakCurrentChunk();
        }, 100);
      }
    } else {
      console.log("Already at last chunk");
    }
  };

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.voice} onPress={() => router.push("/voices/selectVoice")}>
        <View style={styles.voiceImg}>
          <Image source={Pic} style={styles.Img} />
        </View>
        <Text style={styles.voiceTxt}>Voices</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice} onPress={restart}>
        <FontAwesome6 name="rotate-left" size={22} color="#9E9898" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.voiceBtn} onPress={speak}>
        {playing ? (
          <FontAwesome name="pause" size={29} color="white" />
        ) : (
          <FontAwesome name="play" size={22} color="white" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice} onPress={skipForward}>
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

export default TTSFunction;

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



// import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from "react-native";
// import React, { useState, useEffect } from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import Pic from "../assets/images/profile.jpg";
// import * as Speech from "expo-speech";
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';
// import { router } from "expo-router";

// // Define your API URL - replace with your actual Render.com URL when deployed
// const API_URL = "https://yarngpt-api.onrender.com";

// const TTSFunction = ({ text, onBoundary }) => {
//   const [playing, setPlaying] = useState(false);
//   const [speed, setSpeed] = useState(0.8);
//   const [currentChunk, setCurrentChunk] = useState(0);
//   const [textChunks, setTextChunks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sound, setSound] = useState(null);
//   const [selectedVoice, setSelectedVoice] = useState("idera");
//   const MAX_CHUNK_SIZE = 3000; // Safe limit for most devices
  
//   // Voice options from YarnGPT (Nigerian accents)
//   const voiceOptions = [
//     "idera", "emma", "jude", "osagie", "tayo", 
//     "zainab", "joke", "regina", "remi", "umar", "chinenye"
//   ];

//   // Split text into manageable chunks on component mount or when text changes
//   useEffect(() => {
//     if (!text) {
//       setTextChunks([]);
//       return;
//     }
    
//     // Split by sentences to avoid cutting in the middle of speech
//     const sentences = text.split(/(?<=[.!?])\s+/);
//     const chunks = [];
//     let currentChunk = "";
    
//     sentences.forEach(sentence => {
//       // If adding this sentence would exceed the chunk size, start a new chunk
//       if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
//         if (currentChunk.length > 0) {
//           chunks.push(currentChunk);
//         }
//         currentChunk = sentence;
//       } else {
//         currentChunk += (currentChunk ? " " : "") + sentence;
//       }
//     });
    
//     // Add the last chunk if it's not empty
//     if (currentChunk.length > 0) {
//       chunks.push(currentChunk);
//     }
    
//     setTextChunks(chunks);
//     setCurrentChunk(0);
//     console.log(`Text split into ${chunks.length} chunks`);
//   }, [text]);

//   useEffect(() => {
//     // Cleanup when component unmounts
//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//       Speech.stop();
//       setPlaying(false);
//     };
//   }, []);
  
//   // Choose between native TTS or YarnGPT API
//   const speak = async () => {
//     if (textChunks.length === 0) {
//       console.log("No text to speak");
//       return;
//     }
    
//     if (playing) {
//       console.log("Stopping speech");
      
//       if (sound) {
//         await sound.stopAsync();
//         setSound(null);
//       } else {
//         Speech.stop();
//       }
      
//       setPlaying(false);
//     } else {
//       console.log("Starting speech");
      
//       // Determine if we should use YarnGPT (Nigerian accent) or device TTS
//       const useYarnGPT = selectedVoice !== "device";
      
//       if (useYarnGPT) {
//         // Use YarnGPT API
//         await speakWithYarnGPT(textChunks[currentChunk]);
//       } else {
//         // Use device TTS
//         await Speech.stop();
//         setPlaying(true);
//         setTimeout(() => {
//           speakCurrentChunk();
//         }, 100);
//       }
//     }
//   };

//   const speakWithYarnGPT = async (text) => {
//     try {
//       setLoading(true);
//       setPlaying(true);
      
//       console.log(`Requesting YarnGPT TTS for: "${text.substring(0, 50)}..."`);
      
//       // Create a temporary file path for the downloaded audio
//       const fileUri = `${FileSystem.cacheDirectory}yarngpt_audio_${Date.now()}.wav`;
      
//       // Make POST request to your YarnGPT API
//       const response = await FileSystem.downloadAsync(
//         `${API_URL}/api/tts`,
//         fileUri,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           method: 'POST',
//           body: JSON.stringify({
//             text: text,
//             speaker: selectedVoice,
//             temperature: 0.1,
//             repetition_penalty: 1.1
//           }),
//         }
//       );
      
//       console.log("Download complete:", response);
      
//       if (response.status === 200) {
//         // Play the downloaded audio
//         const { sound: newSound } = await Audio.Sound.createAsync(
//           { uri: fileUri },
//           { shouldPlay: true },
//           onPlaybackStatusUpdate
//         );
        
//         setSound(newSound);
//         setLoading(false);
//       } else {
//         throw new Error(`API returned status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error with YarnGPT TTS:", error);
//       setLoading(false);
//       setPlaying(false);
//       Alert.alert("Error", "Failed to generate speech. Please try again later.");
//     }
//   };
  
//   const onPlaybackStatusUpdate = (status) => {
//     if (status.didJustFinish) {
//       // Sound finished playing
//       setPlaying(false);
//       setSound(null);
      
//       // Move to next chunk if we have more
//       if (currentChunk < textChunks.length - 1) {
//         setCurrentChunk(prev => prev + 1);
//         // Optionally auto-play next chunk here
//       } else {
//         // All chunks finished
//         setCurrentChunk(0);
//       }
//     }
//   };

//   const speakCurrentChunk = async () => {
//     if (textChunks.length === 0 || currentChunk >= textChunks.length) return;
    
//     try {
//       console.log(`Speaking chunk ${currentChunk + 1} of ${textChunks.length}`);
//       Speech.speak(textChunks[currentChunk], {
//         language: "en-US",
//         rate: speed,
//         pitch: 1.1,
//         onBoundary: onBoundary,
//         onDone: handleChunkFinished,
//         onStopped: () => setPlaying(false),
//         onError: (error) => {
//           console.log("Speech error:", error);
//           setPlaying(false);
//         }
//       });
//     } catch (error) {
//       console.log("Error in speech:", error);
//       setPlaying(false);
//     }
//   };
  
//   const handleChunkFinished = () => {
//     if (currentChunk < textChunks.length - 1) {
//       // More chunks to speak
//       console.log(`Chunk ${currentChunk + 1} finished, moving to next chunk`);
//       setCurrentChunk(prev => prev + 1);
//       // Small delay before starting the next chunk
//       setTimeout(() => {
//         speakCurrentChunk();
//       }, 300);
//     } else {
//       // All chunks finished
//       console.log("All chunks finished");
//       setPlaying(false);
//       setCurrentChunk(0);
//     }
//   };

//   const increaseSpeed = () => {
//     setSpeed((prevSpeed) => {
//       const newSpeed = prevSpeed < 2.0 ? prevSpeed + 0.25 : 1.0;
//       console.log(`Speed changed to ${newSpeed.toFixed(2)}x`);
//       return newSpeed;
//     });
//   };

//   const restart = () => {
//     console.log("Restarting speech from beginning");
//     if (sound) {
//       sound.stopAsync();
//       sound.unloadAsync();
//       setSound(null);
//     } else {
//       Speech.stop();
//     }
//     setCurrentChunk(0);
//     setPlaying(false);
//   };

//   const skipForward = () => {
//     if (currentChunk < textChunks.length - 1) {
//       console.log("Skipping to next chunk");
//       if (sound) {
//         sound.stopAsync();
//         sound.unloadAsync();
//         setSound(null);
//       } else {
//         Speech.stop();
//       }
//       setCurrentChunk(prev => prev + 1);
//       setPlaying(false);
//     } else {
//       console.log("Already at last chunk");
//     }
//   };
  
//   const cycleVoice = () => {
//     // Add "device" option to use the regular device TTS
//     const allOptions = [...voiceOptions, "device"];
//     const currentIndex = allOptions.indexOf(selectedVoice);
//     const nextIndex = (currentIndex + 1) % allOptions.length;
//     const newVoice = allOptions[nextIndex];
    
//     setSelectedVoice(newVoice);
//     console.log(`Voice changed to: ${newVoice}`);
    
//     // Show feedback to user
//     Alert.alert("Voice Changed", `Now using ${newVoice === "device" ? "device TTS" : `Nigerian accent (${newVoice})`}`);
//   };

//   // Rest of your component's render code here...
//   return (
//     <View style={styles.container}>
//       {/* Display current voice/speaker */}
//       <Text style={styles.voiceLabel}>
//         Voice: {selectedVoice === "device" ? "Device TTS" : `Nigerian (${selectedVoice})`}
//       </Text>
      
//       <View style={styles.controls}>
//         <TouchableOpacity onPress={restart} style={styles.button}>
//           <FontAwesome name="refresh" size={20} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={speak} style={styles.mainButton}>
//           {loading ? (
//             <Text>Loading...</Text>
//           ) : playing ? (
//             <FontAwesome name="pause" size={24} color="#fff" />
//           ) : (
//             <FontAwesome name="play" size={24} color="#fff" />
//           )}
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={cycleVoice} style={styles.button}>
//           <FontAwesome name="microphone" size={20} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={skipForward} style={styles.button}>
//           <FontAwesome name="step-forward" size={20} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={increaseSpeed} style={styles.button}>
//           <Text style={styles.speedText}>{speed.toFixed(2)}x</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Progress indicator */}
//       {textChunks.length > 1 && (
//         <Text style={styles.progressText}>
//           {currentChunk + 1} / {textChunks.length}
//         </Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   button: {
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: '#e0e0e0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 40,
//     height: 40,
//   },
//   mainButton: {
//     padding: 15,
//     borderRadius: 30,
//     backgroundColor: '#4b7bec',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 60,
//     height: 60,
//   },
//   speedText: {
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   progressText: {
//     textAlign: 'center',
//     marginTop: 10,
//     color: '#666',
//   },
//   voiceLabel: {
//     textAlign: 'center',
//     marginBottom: 10,
//     fontWeight: 'bold',
//     color: '#444',
//   },
// });

// export default TTSFunction;