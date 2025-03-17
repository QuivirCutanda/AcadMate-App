import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface StudyCardProps {
  icon: React.ComponentType<any>;
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  title: string;
  description: string;
  onPress: () => void;
}

const StudyCard: React.FC<StudyCardProps> = ({
  icon: Icon,
  iconName,
  iconSize = 32,
  iconColor,
  title,
  description,
  onPress,
}) => (
  <TouchableOpacity
    className="flex-row items-center bg-secondary rounded-2xl p-4 gap-4"
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Icon name={iconName} size={iconSize} color={iconColor} />
    <View>
      <Text className="text-primary text-xl font-bold">{title}</Text>
      <Text className="text-primary text-base font-normal">{description}</Text>
    </View>
  </TouchableOpacity>
);

export default StudyCard;
