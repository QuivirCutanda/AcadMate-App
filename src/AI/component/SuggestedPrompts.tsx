import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import suggestedPrompts from "@/constant/data/sudgestedPromps.json";

const iconMapping: Record<string, React.ComponentType<any>> = {
  summarize: MaterialIcons,
  "laptop-code": FontAwesome5,
  book: AntDesign,
  calculate: MaterialIcons,
};

interface SuggestedPromptsProps {
  handlePress: (description: string) => void;
  IsHidden: boolean;
}

const SuggestedPrompts = ({ handlePress, IsHidden }: SuggestedPromptsProps) => {
  if (IsHidden) return null;

  return (
    <View className="flex-1 justify-center items-center mt-14 px-4">
      <Text className="text-xl text-secondary font-bold mb-4">
        What can I help with?
      </Text>
      <View className="flex-row flex-wrap items-center justify-center w-full">
        {suggestedPrompts.map(({ id, iconName, title, description }, index) => {
          const IconComponent = iconMapping[iconName];

          return (
            <Animated.View
              key={id}
              className="w-[60%] p-2 justify-center items-center"
              entering={FadeInUp.delay(index * 100).springify()}
            >
              <TouchableOpacity
                className="flex-row items-center gap-2 rounded-3xl border border-secondary px-4 py-3"
                activeOpacity={0.7}
                onPress={() => handlePress(description)}
              >
                {IconComponent && <IconComponent name={iconName} size={24} color="#005596" />}
                <Text className="text-sm font-bold text-secondary">{title}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default SuggestedPrompts;
