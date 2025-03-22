import { Tabs } from "expo-router";
import React from "react";
import { ScrollProvider } from "@/components/ScrollContext";

export default function TabLayout() {
  return (
    <ScrollProvider>
      <Tabs
        screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
      >
        <Tabs.Screen name="index" options={{ title: "Me" }} />
        <Tabs.Screen name="updateProfile" options={{ title: "UpdateProfile"}} />
      </Tabs>
    </ScrollProvider>
  );
}
