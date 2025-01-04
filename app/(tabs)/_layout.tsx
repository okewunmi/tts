// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';

// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }


import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FA9884",
          tabBarInactiveTintColor: "#9E9898",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#423D3D",
            paddingTop: 8,
            height: 60,
            alignSelf: "center",
            justifyContent: "center",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Foundation
                name={"home"}
                size={focused ? 30 : 25}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            title: "folder",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name={"add-box"}
                size={focused ? 35 : 30}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"person"}
                size={focused ? 30 : 25}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#f2f2f2" style="dark" />
    </>
  );
};

export default TabLayout;
