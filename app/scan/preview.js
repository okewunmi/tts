// import React, { useState, useRef } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Platform,
// } from 'react-native';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

// const Preview = () => {
//   const [uploadingToServer, setUploadingToServer] = useState(false);

//   const handleCapture = async () => {};

//   return (
//     <View style={styles.container}>
//       <View style={styles.paginate}>
//         <TouchableOpacity>
//           <FontAwesome name="arrow-left" size={22} color="black" />
//         </TouchableOpacity>

//         <View style={styles.paginateNum}>
//           <Text> image 1 of 6</Text>
//         </View>
//         <TouchableOpacity>
//           <FontAwesome name="arrow-right" size={22} color="black" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.bottom}>
//         <TouchableOpacity style={styles.btn}>
//           <View>
//             <Text style={styles.txt}>Continue</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   bottom: {
//     height: 110,
//     backgroundColor: 'rgb(8, 7, 7)',
//     flexDirection: 'row',
//     paddingHorizontal: 50,
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'center',
//   },
//   btn: {
//     backgroundColor: '#3273F6',
//     paddingVertical: 13,
//     paddingHorizontal: 70,
//     borderRadius: 60,
//   },
//   txt: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   paginate: {
//     alignItems: 'center',
//     paddingVertical: 15,
//     justifyContent: 'center',
//     gap: 20,
//     flexDirection: 'row',
//   },
//   paginateNum: {
//     paddingVertical: 2,
//     paddingHorizontal: 15,
//     backgroundColor: '#cecece',
//     borderRadius: 20,
//   },
// });

// export default Preview;

// Preview.js
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGlobalContext } from '../../context/GlobalProvider';

const Preview = () => {
  const { images } = useGlobalContext();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const goPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goNext = () => {
    if (currentIndex < images.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No images to preview</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[styles.image, { width: screenWidth }]} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={getItemLayout}
      />

      <View style={styles.paginate}>
        <TouchableOpacity onPress={goPrev} disabled={currentIndex === 0}>
          <FontAwesome name="arrow-left" size={22} color={currentIndex === 0 ? "#999" : "#fff"} />
        </TouchableOpacity>

        <View style={styles.paginateNum}>
          <Text>{`image ${currentIndex + 1} of ${images.length}`}</Text>
        </View>

        <TouchableOpacity onPress={goNext} disabled={currentIndex === images.length - 1}>
          <FontAwesome name="arrow-right" size={22} color={currentIndex === images.length - 1 ? "#999" : "#fff"} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.txt}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  image: {
    height: '100%',
    resizeMode: 'contain',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },
  paginate: {
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    gap: 20,
    flexDirection: 'row',
    // backgroundColor: '#fff',
  },
  paginateNum: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    backgroundColor: '#cecece',
    borderRadius: 20,
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
});
