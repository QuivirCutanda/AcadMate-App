import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

import { useScroll } from "@/components/ScrollContext";
import Header from "@/src/components/Header";
import CircularProgress from "@/src/components/CircularProgress";
import Button from "@/src/components/Button";
import TodoCard from "@/src/components/todolist/TodoCard";
import BalanceCard from "@/src/components/finance/BalanceCard";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AskAIButton from "@/src/components/AskAIButton"; // Import new component

const studyData = [
  { id: 1, title: "Study", progress: 50, icon: AntDesign, iconName: "book" },
  {
    id: 2,
    title: "Read",
    progress: 70,
    icon: FontAwesome5,
    iconName: "book-reader",
  },
  {
    id: 3,
    title: "Exercise",
    progress: 30,
    icon: MaterialIcons,
    iconName: "fitness-center",
  },
  {
    id: 4,
    title: "Meditate",
    progress: 90,
    icon: MaterialIcons,
    iconName: "self-improvement",
  },
  {
    id: 5,
    title: "Exercise",
    progress: 30,
    icon: MaterialIcons,
    iconName: "fitness-center",
  },
  {
    id: 6,
    title: "Meditate",
    progress: 90,
    icon: MaterialIcons,
    iconName: "self-improvement",
  },
  {
    id: 7,
    title: "Meditate",
    progress: 90,
    icon: MaterialIcons,
    iconName: "self-improvement",
  },
];

const StudyScreen = () => {
  const { scrollHandler } = useScroll();

  return (
    <View className="flex-1">
      <Header />
      <Animated.ScrollView
        className="flex-1 p-4"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard />
        <View className="flex-row items-center justify-between p-4 bg-secondary rounded-2xl mt-4">
          <View className="flex-col">
            <Text className="font-normal text-base text-center text-primary">
              Your daily task
            </Text>
            <Text className="font-normal text-base text-center text-primary">
              almost done!
            </Text>
            <View className="w-[80%]">
              <Button
                title="View task"
                onPress={() => console.log("Button task clicked.")}
              />
            </View>
          </View>
          <CircularProgress
            size={90}
            progress={30}
            color="hsl(206, 100%, 70%)"
            textColor="#FFFFFF"
            backgroundColor="hsl(206, 100%, 90%)"
          />
        </View>

        <View className="my-4">
          <View className="flex-row justify-between mt-4">
            <Text className="font-bold text-secondary text-base">
              Today's task
            </Text>
            <TouchableOpacity onPress={() => console.log("See all pressed")}>
              <Text className="font-normal text-base text-secondary">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between gap-4 mt-4">
            {studyData.length ? (
              studyData.map((item) => (
                <TouchableOpacity key={item.id} className="w-[47%]">
                  <TodoCard {...item} iconColor="#FFFFFF" />
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-secondary text-lg text-center">
                No data available
              </Text>
            )}
          </View>
        </View>
        <View className="pb-40"></View>
      </Animated.ScrollView>

      {/* Ask AI Button */}
      <TouchableOpacity onPress={() => console.log("AI clicked..")}>
        <AskAIButton />
      </TouchableOpacity>
    </View>
  );
};

export default StudyScreen;
