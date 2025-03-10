import { View, Text } from "react-native";
import React from "react";
import Header from "@/src/components/Header";
import StudyCard from "@/src/study/StudyCard";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import AskAIButton from "@/src/components/AskAIButton";
import { useScroll } from "@/components/ScrollContext";

const StudyList = [
  {
    icon: MaterialIcons,
    iconName: "format-list-bulleted",
    title: "Todo List",
    description: "Stay organized with task lists.",
  },
  {
    icon: MaterialCommunityIcons,
    iconName: "cards",
    title: "Flash Card",
    description: "Memorize fast with flashcards.",
  },
  {
    icon: MaterialIcons,
    iconName: "notes",
    title: "Notes",
    description: "Jot down and save ideas.",
  },
  {
    icon: Ionicons,
    iconName: "alarm",
    title: "Alarm Clock",
    description: "Never miss study time!",
  },
];
const study = () => {
  const { scrollHandler } = useScroll();
  const router = useRouter();
  return (
    <>
      <Header />
      <Animated.ScrollView
        className="flex-1 p-4"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-secondary my-4 pb-4">
          How can I help you?
        </Text>
        {StudyList.map((item, index) => (
          <View className="mb-4" key={index}>
            <StudyCard
              icon={item.icon}
              iconName={item.iconName}
              iconSize={40}
              title={item.title}
              description={item.description}
              iconColor="#FFFFFF"
              onPress={() => console.log("OK")}
            />
          </View>
        ))}
      </Animated.ScrollView>
      <AskAIButton onPress={() =>router.push("/(tabs-AI)")} />
    </>
  );
};

export default study;
