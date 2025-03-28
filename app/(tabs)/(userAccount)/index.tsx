import React, { useEffect, useState } from "react";
import { View, Text, ToastAndroid, ScrollView } from "react-native";
import settingsData from "@/constant/data/settings.json";
import Avatar from "@/src/components/Avatar";
import SettingItem from "@/src/components/userAccount/userAccount";
import { useRouter } from "expo-router";
import {
  getAllUsers,
  subscribeToUserUpdates,
} from "@/src/database/userQueries";

const Account = () => {
  const [notifications, setNotifications] = useState(false);
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profile_pic: null as string | null,
  });

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

  useEffect(() => {
    fetchUserData();
    const unsubscribe = subscribeToUserUpdates(() => {
      console.log("Refreshing...");
      fetchUserData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleOnPress = (id: number) => {
    switch (id) {
      case 1:
        router.navigate("./updateProfile");
        console.log(1);
        break;
      case 2:
        console.log(2);
        break;
      case 3:
        setNotifications((prev) => {
          const newValue = !prev;
          ToastAndroid.show(
            newValue ? "Turn On Notification" : "Turn Off Notification",
            ToastAndroid.SHORT
          );
          return newValue;
        });
        break;
      case 4:
        console.log(4);
        break;
      case 5:
        console.log(5);
        break;
    }
  };

  return (
    <View className="flex-1 items-center gap-4 bg-[#E0E0E0]">
      <View className="bg-secondary w-full p-8 rounded-b-3xl items-center gap-4">
        <Avatar
          size={80}
          source={
            userData.profile_pic
              ? { uri: userData.profile_pic }
              : require("@/assets/Avatar/user.png")
          }
        />

        <Text className="text-lg font-bold text-primary text-center">
          {userData.firstname
            ? userData.firstname + " " + userData.lastname
            : "Hello, User"}
        </Text>
      </View>

      <View className="w-full flex-1">
        <Text className="text-base font-bold text-gray-400 pl-4">
          Preferences
        </Text>
        <ScrollView className="p-4">
          {settingsData.map((item,index) => (
            <SettingItem
              className={`${settingsData.length -1 == index&&"mb-20"}`}
              key={item.id}
              title={item.title}
              icon={item.icon}
              onPress={() => handleOnPress(item.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Account;
