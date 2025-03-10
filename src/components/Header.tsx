import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Avatar from "@/src/components/Avatar";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = () => {
  return (
    <View className="flex-row items-center justify-between py-4 bg-secondary rounded-b-3xl shadow-lg shadow-black">
      <Avatar source={require("@/assets/Avatar/avatar.jpg")} size={34} />
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary">
          Hi, Quivir Cutanda
        </Text>
        <Text className="text-base text-primary ">01 Jan 2024</Text>
      </View>
      <TouchableOpacity
        className="p-4"
        onPress={() => console.log("Pressed Notification")}
      >
        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        <View className="absolute bottom-7 left-4 bg-red-600 rounded-full p-2"></View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
