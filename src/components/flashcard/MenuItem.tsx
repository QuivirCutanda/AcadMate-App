import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

interface MenuItemProps {
  label: string;
  Icon: React.ComponentType<any>;
  iconName: string;
  iconColor?: string;
  textColor?: string; 
  onPress: () => void;
}

const MenuItem = ({
  label,
  Icon,
  iconName,
  iconColor = "#000",
  textColor = "text-secondary", 
  onPress,
}: MenuItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      className="flex-row justify-start items-center gap-4 mb-4"
    >
      <Icon name={iconName as any} size={18} color={iconColor} />
      <Text className={`text-base font-normal ${textColor}`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;
