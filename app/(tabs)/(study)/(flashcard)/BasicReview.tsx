import { View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import FlipStudy from "@/src/components/flashcard/study/FlipCard";
import { router, useLocalSearchParams } from "expo-router";
import {
  dbEventEmitter,
  getFlashcardsByDeck,
} from "@/src/database/FashcardQueries";
import { useFocusEffect } from "@react-navigation/native";
import Header from "@/src/components/flashcard/Header";

const StudyScreen = () => {
  const [cardItem, setCardItem] = useState<
    { id: number; question: string; answer: string }[]
  >([]);
  const { deckId, StudyType } = useLocalSearchParams();

  useEffect(() => {
    console.log("Deck ID: ", deckId, "Study Type: ", StudyType);
  }, [deckId, StudyType]);

  const fetchFlashcards = useCallback(async () => {
    if (!deckId) return;
    const data = await getFlashcardsByDeck(Number(deckId));
    setCardItem(data || []);
  }, [deckId]);

  useFocusEffect(
    useCallback(() => {
      fetchFlashcards();

      const handleFlashcardsUpdated = fetchFlashcards;
      dbEventEmitter.on("flashcardsUpdated", handleFlashcardsUpdated);

      return () => {
        dbEventEmitter.off("flashcardsUpdated", handleFlashcardsUpdated);
      };
    }, [fetchFlashcards])
  );

  return (
    <View className="flex-1">
      <Header onPress={router.back} title="Basic Review"/>
      <FlipStudy flashcards={cardItem} />
    </View>
  );
};

export default StudyScreen;
