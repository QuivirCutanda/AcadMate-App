import React, { useEffect, useState } from "react";
import { View, Text, ToastAndroid } from "react-native";
import settingsData from "@/constant/data/settings.json";
import Avatar from "@/src/components/Avatar";
import SettingItem from "@/src/components/userAccount/userAccount";
import { useRouter } from "expo-router";
import { loadUserData } from "@/src/components/userAccount/utils/storage";

const Account = () => {
  const [notifications, setNotifications] = useState(false);
  const router = useRouter();
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
    <View className="flex-1 items-center gap-4">
      <View className="bg-secondary w-full p-8 rounded-b-3xl items-center gap-4">
        <Avatar
          size={80}
          source={
            userData.profilePic
              ? { uri: userData.profilePic }
              : require("@/assets/Avatar/user.png")
          }
        />

        <Text className="text-lg font-bold text-primary text-center">
          {userData.firstName
            ? userData.firstName + " " + userData.lastName
            : "Hello, User"}
        </Text>
      </View>

      <View className="w-full p-4 flex-1">
        <Text className="text-base font-bold text-gray-400 py-4">
          Preferences
        </Text>
        {settingsData.map(({ id, title, icon, isSwitch }) => (
          <SettingItem
            key={id}
            title={title}
            icon={icon}
            isSwitch={isSwitch}
            switchValue={notifications}
            onSwitchToggle={setNotifications}
            onPress={() => handleOnPress(id)}
          />
        ))}
      </View>
    </View>
  );
};

export default Account;
