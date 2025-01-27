import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const FileView = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>
        <TextInput
          multiline
          editable
          inputMode="text"
          placeholder="Write or paste your text here..."
          style={styles.inputText}
        />
      </ScrollView>
      <TouchableOpacity style={styles.btnBox}>
        <View style={styles.view}>
          <Text style={styles.txt}>Save</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -26,
    height: "100%",
  },
  inputText: {
    width: "100%",
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: "light",
    wordSpacing: 10,
    textAlign: "justify",
  },
  btnBox: {
    alignSelf: 'center',
    marginBottom: 25,
    backgroundColor: "#3273F6",
    padding: 15,
    borderRadius: 25,
    width: "90%",
    justifyContent: "center",
  },
  view:{
    alignSelf: 'center',
  },
  txt:{
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default FileView;
