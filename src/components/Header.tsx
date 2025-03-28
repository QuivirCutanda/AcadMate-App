import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Avatar from "@/src/components/Avatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
interface HeaderProps{
userInfo:any;
}

const Header = ({userInfo}:HeaderProps) => {
  const router = useRouter();
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
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          router.navigate("/(tabs)/(userAccount)");
        }}
      >
        <Avatar
          source={
            userInfo.profile_pic
              ? { uri: userInfo.profile_pic }
              : require("@/assets/Avatar/user.png")
          }
          size={34}
        />
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary">
          {userInfo.firstname
            ? `Hi, ${userInfo.firstname} ${userInfo.lastname}`
            : "Welcome User"}
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
