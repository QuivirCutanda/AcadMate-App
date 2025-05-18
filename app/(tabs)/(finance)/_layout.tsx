// TabLayout.tsx
import { Tabs } from "expo-router";
import React from "react";
import TabBar from "@/components/tab-bar/TabBar";
import { ScrollProvider } from "@/components/ScrollContext";

export default function TabLayout() {
  return (
    <ScrollProvider>
      <Tabs
        screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
      >
        <Tabs.Screen name="finance" options={{ title: "Finance" }} />
      </Tabs>
    </ScrollProvider>
  );
}
