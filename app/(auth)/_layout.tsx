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
        <Stack.Screen name="intro2" options={{ headerShown: false }} />
        <Stack.Screen name="intro3" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerBackVisible: true, headerTitle: '' }} />
        <Stack.Screen name="signUp" options={{ headerBackVisible: true, headerTitle: '' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
};

export default Layout;
