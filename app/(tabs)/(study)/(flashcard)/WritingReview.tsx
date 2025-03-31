import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {shakeAnimation,triggerShake} from "@/src/hooks/useTreggerShake";
import {
  dbEventEmitter,
  getFlashcardsByDeck,
} from "@/src/database/FashcardQueries";
import { useFocusEffect } from "@react-navigation/native";
import Header from "@/src/components/flashcard/Header";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Success from "@/assets/animation/celebration.json";
import LottieView from "lottie-react-native";
const WritingReview = () => {
  const [cardItem, setCardItem] = useState<
    { id: number; question: string; answer: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deckId } = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      handleRestart();
      fetchFlashcards()
    }, [])
  );
  
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };
  
  const fetchFlashcards = useCallback(async () => {
    if (!deckId) return;
    const data = await getFlashcardsByDeck(Number(deckId));
    setCardItem(shuffleArray(data || []));
  }, [deckId]);
  

  const handleSubmit = () => {
    if (userInput.trim() === "") {
      return;
    }

    if (
      userInput.trim().toLowerCase() ===
      cardItem[currentIndex]?.answer.toLowerCase()
    ) {
      setUserInput("");
      setLoading(true);
      setFeedback("Correct!");
      setCorrectCount((prev) => prev + 1);
    } else {
      setUserInput("");
      setLoading(true);
      setFeedback("Wrong!");
      setWrongCount((prev) => prev + 1);
      triggerShake();
    }

    setTimeout(() => {
      setFeedback("");
      setUserInput("");
      setLoading(false);
      if (currentIndex + 1 < cardItem.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCardItem((prev) => shuffleArray([...prev])); 
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setIsCompleted(false);
    setUserInput("");
  };
  

  return (
    <View className="flex-1">
      <Header onPress={router.back} title="Writing Review" />
      {cardItem.length > 0 ? (
        isCompleted ? (
          <View className="flex-1 justify-center items-center">
            <View className="flex justify-center items-center">
              <LottieView
                loop={false}
                autoPlay
                source={Success}
                style={{
                  width: 200,
                  height: 200,
                  position: "absolute",
                  top: -100,
                }}
              />
              <Text className="text-2xl font-bold mb-4">Review Completed!</Text>
              <Text className="text-lg">Correct Answers: {correctCount}</Text>
              <Text className="text-lg mb-4">Wrong Answers: {wrongCount}</Text>
            </View>
            <TouchableOpacity
              onPress={handleRestart}
              className="p-4 rounded-2xl bg-secondary gap-2 flex-row mt-4"
            >
              <MaterialIcons name="restart-alt" size={24} color="#FFFFFF" />
              <Text className="text-primary">Restart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Animated.View
              style={{ transform: [{ translateX: shakeAnimation }] }}
              className="bg-secondary flex-1 justify-center items-center w-full rounded-2xl mb-4 p-4"
            >
              <Text className="text-xl font-bold mb-4 text-primary">
                {cardItem[currentIndex]?.question}
              </Text>
            </Animated.View>

            <Text className="text-lg text-center font-bold mb-4 text-green-500 w-full">
              {feedback && cardItem[currentIndex]?.answer}
            </Text>

            <View className="flex-row gap-2 justify-center items-end mb-8 mt-4">
              <Animated.View
                style={{ transform: [{ translateX: shakeAnimation }] }}
                className={`flex-1`}
              >
                <TextInput
                  className="border border-secondary/50 p-4 rounded-2xl text-secondary placeholder:text-secondary/50 focus:border-secondary"
                  placeholder="Enter your answer"
                  value={userInput}
                  onChangeText={setUserInput}
                  selectionColor="#005596"
                  multiline
                  textAlignVertical="top"
                  numberOfLines={5}
                  style={{ minHeight: 10, maxHeight: 150 }}
                />
              </Animated.View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSubmit}
                disabled={loading}
                className={`p-4 bg-secondary rounded-2xl`}
              >
                <AntDesign name="arrowup" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : (
        <Text className="text-center mt-10">No flashcards available</Text>
      )}
    </View>
  );
};

export default WritingReview;
