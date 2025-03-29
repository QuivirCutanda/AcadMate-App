import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps{
  onPress:()=>void;
  title?:string;
}

const header = ({onPress,title}:HeaderProps) => {
  return (
    <View className="bg-background-light">
      <View className="bg-secondary p-4 flex-row items-center rounded-b-3xl">
        <TouchableOpacity onPress={onPress} className="flex-1">
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">{title}</Text>
        <View className="flex-1"></View>
      </View>
    </View>
  );
};

export default header;
