import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from "react-native-safe-area-context";
import React, {useState} from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Link} from 'expo-router'

const signUp = () => {
   const [isChecked, setChecked] = useState(false);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.view}>
        <Text style={styles.heading}>Join Voxify Today </Text>
        <Text style={styles.txt}>
          Sign up to unlock the full power of Voxify
        </Text>
      </View>

      <View style={styles.inputBox}>
        <View style={styles.Box}>
          <Text style={styles.label}>Email </Text>
          <TouchableOpacity style={styles.touchInput}>
            <MaterialCommunityIcons
              name="email-outline"
              size={22}
              color="black"
            />
            <TextInput placeholder="Email" style={styles.input} />
          </TouchableOpacity>
        </View>
        <View style={styles.Box}>
          <Text style={styles.label}>Password </Text>
          <TouchableOpacity style={styles.touchInput}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={22}
              color="black"
            />
            <TextInput placeholder="Password" style={styles.input} />
          </TouchableOpacity>
        </View>
        <View style={styles.boxprivacy}>
          <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '' : '#3273F6'}
        />
          <Text style={styles.privacy}>I agreed to Voxify </Text>
          <Link href='' style={styles.privacy2}>Terms & Conditions. </Link>
        </View>
        <View style={styles.boxsignIn}>
          <Text style={styles.privacy}>Already have an account?  </Text>
          <Link href='/signIn' style={styles.privacy2}>Sign in </Link>
        </View>

        <View style={ styles.other}>
          <View style={styles.line}></View>
          <Text style={styles.othertext}>or continue with</Text>
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
  privacy: {
    fontSize: 13,
    color: "grey",
  },
  inputBox: {
    marginTop: 40,
    gap: 22,
  },
  Box: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  touchInput: {
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ecf0f1",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  input: {
    height: "100%",
  },
  boxprivacy: {
    flexDirection: "row",
  },
  boxsignIn: {
    flexDirection: "row",
    justifyContent: 'center'
  },
  checkbox: {
    marginRight: 15,
   
  },
  privacy2: {
    color: '#3273F6',
    fontSize: 13,
  },
  other: {
    marginTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
     
  },
  othertext: {
    color: 'grey',
    paddingHorizontal: 8,
    fontSize: 18,
    marginTop: -15,
  backgroundColor: '#fff'
  },
  line: {
    borderBottomWidth: 2,
    borderColor: '#ecf0f1',
    width: '100%',
  }
  
});
