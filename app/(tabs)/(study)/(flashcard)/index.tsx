import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { FlashcardTable } from "@/src/database/FlashcardsTable";
const index = () => {
  useEffect(() => {
    FlashcardTable();
  });

  return (
    <View className="flex-1 bg-background-ligth p-4 justify-center items-center">
      <Text className="text-lg text-secondary">Flashcard</Text>
    </View>
  );
};

export default index;
