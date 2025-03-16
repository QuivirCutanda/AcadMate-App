import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Feather, Entypo, Fontisto } from "@expo/vector-icons";

const ICONS: Record<string, any> = {
  user: Feather,
  moon: Feather,
  bell: Fontisto,
  "dollar-sign": Feather,
  info: Feather,
};

interface SettingItemProps {
  title: string;
  icon: keyof typeof ICONS;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchToggle?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  icon,
  isSwitch,
  switchValue = false,
  onSwitchToggle,
  onPress,
}) => {
  const IconComponent = ICONS[icon] || Feather;

  return (
    <TouchableOpacity
      className="flex-row justify-between items-center py-4 "
      activeOpacity={0.7}
      onPress={() => {
        onPress?.();
        if (isSwitch && onSwitchToggle) {
          onSwitchToggle(!switchValue);
        }
      }}
    >
      <View className="flex-row gap-4 items-center">
        <IconComponent name={icon} size={24} color="#005596" />
        <Text className="text-base font-bold text-secondary">{title}</Text>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={(value) => onSwitchToggle?.(value)}
          thumbColor={switchValue ? "#005596" : "#ccc"}
          trackColor={{ false: "#767577", true: "#005596" }}
        />
      ) : (
        <Entypo name="chevron-thin-right" size={20} color="#005596" />
      )}
    </TouchableOpacity>
  );
};

export default SettingItem;
