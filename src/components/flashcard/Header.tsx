import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const header = () => {
  const router = useRouter();
  return (
    <View className="bg-background-ligth">
      <View className="bg-secondary p-4 flex-row items-center rounded-b-3xl">
        <TouchableOpacity onPress={router.back} className="flex-1">
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">Flash Card</Text>
        <View className="flex-1"></View>
      </View>
    </View>
  );
};

export default header;
