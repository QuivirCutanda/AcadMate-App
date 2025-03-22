import { Tabs, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ScrollProvider } from "@/components/ScrollContext";
import TabBar from "@/components/tab-bar/TabBar";

export default function TabLayout() {
  const segments: string[] = useSegments();

  useEffect(() => {
    console.log("Current Segments:", segments);
  }, [segments]); 

  // Define the segments where the tab bar should be hidden
  const hiddenSegments = ["(flashcard)","updateProfile"];
  const shouldHideTabBar = segments.some((segment) => hiddenSegments.includes(segment));

  return (
    <ScrollProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: shouldHideTabBar ? { display: "none" } : {},
        }}
        tabBar={(props) => (!shouldHideTabBar ? <TabBar {...props} /> : null)} 
      >
        <Tabs.Screen name="(home)" options={{ title: "Home" }} />
        <Tabs.Screen name="(study)" options={{ title: "Study" }} />
        <Tabs.Screen name="(finance)" options={{ title: "Finance" }} />
        <Tabs.Screen name="(userAccount)" options={{ title: "Me" }} />
      </Tabs>
    </ScrollProvider>
  );
}
