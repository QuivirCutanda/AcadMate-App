import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";

interface ChatHistoryProps {
  title: string;
}
export default function ChatHistory({ title }: ChatHistoryProps) {
  return (
    <TouchableOpacity>
      <Text
        className="text-base font-semibold py-2 px-4 text-secondary"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
