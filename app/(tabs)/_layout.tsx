import { Tabs } from "expo-router";
import React from "react";
import TabBar from "@/components/tab-bar/TabBar";
import { ScrollProvider } from "@/components/ScrollContext";

export default function TabLayout() {
  return (
    <ScrollProvider>
      <Tabs
        screenOptions={() => ({
          headerShown: false,
        })}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen name="(home)" options={{ title: "Home" }} />
        <Tabs.Screen name="(study)" options={{ title: "Study" }} />
        <Tabs.Screen name="(finance)" options={{ title: "Finance" }}/>
        <Tabs.Screen name="(userAccount)" options={{ title: "Me"}} />
      </Tabs>
    </ScrollProvider>
  );
}
