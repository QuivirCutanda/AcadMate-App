import React, { useEffect, useState, useCallback } from "react";
import { View, Text, BackHandler } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MultipleChoice from "@/src/components/flashcard/MultipleChoice/MultipleChoiseTimer";
import { dbEventEmitter, getFlashcardsByDeck } from "@/src/database/FashcardQueries";

const MultipleChoiceTimer = () => {
  const router = useRouter();
  const { deckId, StudyType } = useLocalSearchParams();
  const [studyType, setStudyType] = useState("");
  const [flashcards, setFlashcards] = useState<
    { id: number; question: string; answer: string }[]
  >([]);

  const fetchFlashcards = useCallback(async () => {
    if (!deckId) return;
    try {
      const data = await getFlashcardsByDeck(Number(deckId));
      setFlashcards(data || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  }, [deckId]);

  useEffect(() => {
    setStudyType(Array.isArray(StudyType) ? StudyType[0] : StudyType || "");
  }, [StudyType]);

  useEffect(() => {
    fetchFlashcards();
    const handleFlashcardsUpdated = fetchFlashcards;
    dbEventEmitter.on("flashcardsUpdated", handleFlashcardsUpdated);

    return () => {
      dbEventEmitter.off("flashcardsUpdated", handleFlashcardsUpdated);
    };
  }, [fetchFlashcards]);

  return (
    <View className="flex-1 bg-white">
      {flashcards.length > 0 ? (
        <MultipleChoice flashcards={flashcards} studyType={studyType} onBack={() => router.back()} />
      ) : (
        <Text className="text-lg font-bold text-gray-500">Loading...</Text>
      )}
    </View>
  );
};

export default MultipleChoiceTimer;
