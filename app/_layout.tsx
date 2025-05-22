import React, { useEffect, useCallback } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import GlobalProvider from '../context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons'; // or your icon library
import { TouchableOpacity, View } from 'react-native';

// Prevent auto hiding of splash screen
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    regular: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
      // You might want to handle this error differently
      // For example, show an error screen or use fallback fonts
    }
  }, [error]);

  if (!fontsLoaded && !error) {
    return null; // Keep showing splash screen
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GlobalProvider>
        <Stack
          screenOptions={{
            title: '',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="file/[fileId]"
            options={{
              headerRight: () => (
                <View
                  style={{ flexDirection: 'row', gap: 15, paddingRight: 10 }}
                >
                  <TouchableOpacity
                    onPress={() => console.log('Search pressed')}
                  >
                    <Ionicons name="search" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('Bookmark pressed')}
                  >
                    <Ionicons name="bookmark-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('Share pressed')}
                  >
                    <Ionicons
                      name="share-social-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ),
            }}
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="voices/selectVoice"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="type/typing"
            options={{ headerTitle: 'Write or Paste Text' }}
          />
          {/* <Stack.Screen name="url/[urlId]"   /> */}
          <Stack.Screen
            name="url/[urlId]"
            options={{
              headerRight: () => (
                <View
                  style={{ flexDirection: 'row', gap: 15, paddingRight: 10 }}
                >
                  <TouchableOpacity
                    onPress={() => console.log('Search pressed')}
                  >
                    <Ionicons name="search" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('Bookmark pressed')}
                  >
                    <Ionicons name="bookmark-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('Share pressed')}
                  >
                    <Ionicons
                      name="share-social-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ),
            }}
          />

          <Stack.Screen
            name="txt/[txtId]"
            options={{
              headerRight: () => (
                <View
                  style={{ flexDirection: 'row', gap: 15, paddingRight: 10 }}
                >
                  <TouchableOpacity
                    onPress={() => console.log('Search pressed')}
                  >
                    <Ionicons name="search" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('Bookmark pressed')}
                  >
                    <Ionicons name="bookmark-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('Share pressed')}
                  >
                    <Ionicons
                      name="share-social-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ),
            }}
          />

          <Stack.Screen
            name="scan/scanPage"
            options={{
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white',
            }}
          />
        </Stack>

        <StatusBar style="light" />
      </GlobalProvider>
    </View>
  );
};

export default RootLayout;
