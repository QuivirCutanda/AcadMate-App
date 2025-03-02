import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useScroll } from "@/components/ScrollContext";

const dummyData = Array.from({ length: 20 }, (_, index) => ({
  id: index.toString(),
  title: `Card ${index + 1}`,
  description: `This is the description for card ${index + 1}.`,
}));

const DashBoard = () => {
  const { scrollHandler } = useScroll();

  return (
    <View className="flex-1 bg-primary px-4">
      <Animated.FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="p-4 border  rounded border-secondary mb-4" onPress={()=>console.log("Pressed..")}>
            <Text className="text-lg font-normal text-secondary">
              {item.title}
            </Text>
            <Text className=" text-secondary">{item.description}</Text>
          </TouchableOpacity>
        )}
        onScroll={scrollHandler} 
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DashBoard;
