import "@/gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { useRouter, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "../global.css";
import { Provider as PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const StackLayout = () => {
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );

        if (hasSeenOnboarding === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isFirstLaunch === true) {
      router.replace("/onBoarding");
    }
  }, [isFirstLaunch]);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        animation: "slide_from_right",
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs-AI)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onBoarding" options={{ headerShown: false }} />
      <Stack.Screen name="createAcount" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#005596" />
      <SafeAreaProvider>
        <SafeAreaView
          style={styles.safeContainer}
          edges={["top", "left", "right"]}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <StackLayout />
              </ThemeProvider>
            </PaperProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
