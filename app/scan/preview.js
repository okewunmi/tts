import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Preview = () => {
  const [uploadingToServer, setUploadingToServer] = useState(false);

  const handleCapture = async () => {};

  return (
    <View style={styles.container}>
      <View style={styles.paginate}>
        <TouchableOpacity>
          <FontAwesome name="arrow-left" size={22} color="black" />
        </TouchableOpacity>

        <View style={styles.paginateNum}>
          <Text> image 1 of 6</Text>
        </View>
        <TouchableOpacity>
          <FontAwesome name="arrow-right" size={22} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn}>
          <View>
            <Text style={styles.txt}>Continue</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottom: {
    height: 110,
    backgroundColor: 'rgb(8, 7, 7)',
    flexDirection: 'row',
    paddingHorizontal: 50,
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#3273F6',
    paddingVertical: 13,
    paddingHorizontal: 70,
    borderRadius: 60,
  },
  txt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  paginate: {
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    gap: 20,
    flexDirection: 'row',
  },
  paginateNum: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    backgroundColor: '#cecece',
    borderRadius: 20,
  },
});
 
export default Preview;
