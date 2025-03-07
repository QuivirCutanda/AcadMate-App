import React from "react";
import { View, Text } from "react-native";
import ProgressBar from "@/src/components/ProgressBar";

interface TodoCardProps {
  title: string;
  progress: number;
  icon: React.ComponentType<any>;
  iconName: string;
  iconSize?: number;
  iconColor?: string;
}

const TodoCard: React.FC<TodoCardProps> = ({ 
  title, 
  progress, 
  icon: IconComponent, 
  iconName, 
  iconSize = 16, 
  iconColor = "black" 
}) => (
  <View className="p-4 bg-primary rounded-2xl gap-2">
    <View className="flex-row gap-4 items-center">
      <View className="justify-center items-center w-8 h-8 bg-secondary rounded-full">
        <IconComponent name={iconName} size={iconSize} color={iconColor} />
      </View>
      <Text numberOfLines={2} ellipsizeMode="tail" className="font-semibold text-lg text-secondary">
        {title}
      </Text>
    </View>

    <ProgressBar progress={progress} fillColor="hsl(206, 100%, 70%)" fillBackgroundColor="hsl(206, 100%, 90%)" />
  </View>
);

export default TodoCard;
