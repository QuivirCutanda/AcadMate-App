import React from "react";
import { View, Text } from "react-native";
import { Avatar } from "react-native-paper";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

export default function MessageBubble({ item }: { item: Message }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 5,
        alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
        maxWidth: "80%",
      }}
    >
      {item.sender === "ai" && (
        <Avatar.Text size={32} label="AI" style={{ marginRight: 8 }} />
      )}
      <View
        style={{
          backgroundColor: item.sender === "user" ? "#007AFF" : "#E5E5EA",
          padding: 10,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: item.sender === "user" ? "#fff" : "#000" }} className="text-base">
          {item.text}
        </Text>
      </View>
    </View>
  );
}
