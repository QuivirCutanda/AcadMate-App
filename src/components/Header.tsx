import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Avatar from "@/src/components/Avatar";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setCurrentDate(formattedDate);
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-row items-center justify-between py-4 bg-secondary rounded-b-3xl shadow-lg shadow-black">
      <Avatar source={require("@/assets/Avatar/avatar.jpg")} size={34} />
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary">
          Hi, Quivir Cutanda
        </Text>
        <Text className="text-base text-primary">{currentDate}</Text>
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
