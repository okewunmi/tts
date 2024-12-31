import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Layout = () => {
  return (
    <>
      <Stack screenOptions={{
          contentStyle: { backgroundColor: "#3273F6" }, // Set background color
        }}>
          <Stack.Screen name="intro1" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signOut" options={{ headerShown: false }} />
      </Stack>
       <StatusBar style="light" />
    </>
  );
};

export default Layout;
