import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";

interface AIHeaderProps {
  onPress: () => void;
  onPressEdit: () => void;
  onPressMenu: () => void;
}

const AIHeader: React.FC<AIHeaderProps> = ({
  onPress,
  onPressEdit,
  onPressMenu,
}) => {
  return (
    <View className="flex-row justify-between px-4 py-6 items-center bg-secondary rounded-b-2xl">
      <TouchableOpacity onPress={onPress} className="flex-1 items-start">
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text className="text-lg text-primary font-bold">AcadMate AI</Text>
      <View className="flex-row gap-6 px-2 flex-1 justify-end items-center">
        <TouchableOpacity onPress={onPressEdit}>
          <Feather name="edit" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressMenu}>
          <Feather name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AIHeader;
