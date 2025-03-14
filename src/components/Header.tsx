import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Avatar from "@/src/components/Avatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { loadUserData } from "@/src/components/userAccount/utils/storage";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: null as string | null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await loadUserData();
      setUserData((prev) => ({
        ...prev,
        ...storedData,
      }));
    };
    fetchUserData();
  }, [loadUserData()]);

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
      activeOpacity={.7}
      onPress={()=>router.navigate("/(tabs)/(userAccount)")}
      >
        <Avatar
          source={
            userData.profilePic
              ? { uri: userData.profilePic }
              : require("@/assets/Avatar/user.png")
          }
          size={34}
        />
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary">
          {userData.firstName
            ? userData.firstName + " " + userData.lastName
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
