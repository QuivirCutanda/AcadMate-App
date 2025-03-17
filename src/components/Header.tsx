import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Avatar from "@/src/components/Avatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { getAllUsers } from "@/src/database/userQueries";

const Header = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); 
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profile_pic: null as string | null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getAllUsers();
        if (users && users.length > 0) {
          setUserData({
            firstname: users[0].firstname || "",
            lastname: users[0].lastname || "",
            email: users[0].email || "",
            profile_pic: users[0].profilePic || null,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [refreshKey]); // 🔹 Re-fetch when refreshKey changes

  // Function to trigger a refresh
  const refreshUserData = () => setRefreshKey((prev) => prev + 1);

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
          refreshUserData(); 
        }}
      >
        <Avatar
          source={
            userData.profile_pic
              ? { uri: userData.profile_pic }
              : require("@/assets/Avatar/user.png")
          }
          size={34}
        />
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-lg font-bold text-primary">
          {userData.firstname
            ? `${userData.firstname} ${userData.lastname}`
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
