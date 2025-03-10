import { Tabs } from "expo-router";
import React from "react";
import TabBar from "@/components/tab-bar/TabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "AcadMate AI",
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
