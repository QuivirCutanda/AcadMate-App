import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import settingsData from "@/constant/data/settings.json";
import Avatar from "@/src/components/Avatar";
import SettingItem from "@/src/components/userAccount/userAccount";

const Account = () => {
  const [notifications, setNotifications] = useState(false);

  const handleOnPress = (id: number) => {
    switch (id) {
      case 1:
        console.log(1);
        break;
      case 2:
        console.log(2);
        break;
      case 3:
        !notifications ? setNotifications(true) : setNotifications(false);
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
        <Avatar size={80} source={require("@/assets/Avatar/avatar.jpg")} />

        <Text className="text-lg font-bold text-primary text-center">
          Quivir Cutanda
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
