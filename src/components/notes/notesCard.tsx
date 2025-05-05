import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

interface NotesCardsProps {
  onPress: () => void;
  title: string;
  content: string;
  date: string;
  onDelete:()=>void;
}
const notesCard = ({ onPress,onDelete, title, content, date }: NotesCardsProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-secondary rounded-2xl p-4 mb-2 flex-row"
    >
      <View className="flex-1">
        <Text className="text-primary text-start text-xl font-semibold">
          {title}
        </Text>
        <Text className="text-primary text-start text-base font-normal">
          {content}
        </Text>
        <Text className="text-primary text-start text-xs font-normal">
          {date}
        </Text>
      </View>
      <TouchableOpacity
      onPress={onDelete}
      >
         <Entypo name="dots-three-vertical" size={18} color="#FFFFFF"/>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default notesCard;
