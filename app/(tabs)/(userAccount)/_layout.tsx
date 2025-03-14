// TabLayout.tsx
import { Tabs } from "expo-router";
import React from "react";
import TabBar from "@/components/tab-bar/TabBar";
import { ScrollProvider } from "@/components/ScrollContext";

export default function TabLayout() {
  return (
    <ScrollProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ title: "Me" }} />
        <Tabs.Screen name="updateProfile" options={{ title: "UpdateProfile" }} />
      </Tabs>
    </ScrollProvider>
  );
}
