import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { FlashcardTable } from "@/src/database/FlashcardsTable";
import useHode from "@/src/hooks/useHideTabBar";
const index = () => {
  useEffect(() => {
    FlashcardTable();
  });

  useHode();

  return (
    <View className="flex-1 bg-background-ligth p-4 justify-center items-center">
      <Text className="text-lg text-secondary">Flashcard</Text>
    </View>
  );
};

export default index;
