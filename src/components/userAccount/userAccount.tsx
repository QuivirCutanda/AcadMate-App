import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Entypo, Fontisto } from "@expo/vector-icons";

const ICONS: Record<string, any> = {
  user: Feather,
  moon: Feather,
  bell: Fontisto,
  "dollar-sign": Feather,
  info: Feather,
};

interface SettingItemProps {
  className: string;
  title: string;
  icon: keyof typeof ICONS;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  className,
  title,
  icon,
  onPress,
}) => {
  const IconComponent = ICONS[icon] || Feather;

  return (
    <TouchableOpacity
      className={`flex-row justify-between items-center py-4 ${className}`}
      activeOpacity={0.7}
      onPress={() => {
        onPress?.();
      }}
    >
      <View className="flex-row gap-4 items-center">
        <IconComponent name={icon} size={24} color="#005596" />
        <Text className="text-base font-bold text-secondary">{title}</Text>
      </View>
      <Entypo name="chevron-thin-right" size={20} color="#005596" />
    </TouchableOpacity>
  );
};

export default SettingItem;
