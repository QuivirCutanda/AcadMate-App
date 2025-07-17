import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Vibration,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "@/src/components/flashcard/Header";
import LinearTimer from "@/src/components/LinearTimer";
import Modal from "@/src/components/AnimatedModal";
import Result from "@/src/components/flashcard/MultipleChoice/ModalResult";
import TimerDuration from "@/src/components/flashcard/MultipleChoice/TimerDuration";
import { router, useLocalSearchParams } from "expo-router";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface MultipleChoiceProps {
  flashcards: Flashcard[];
  onBack: () => void;
  studyType: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  flashcards,
  onBack,
  studyType,
}) => {
  const { StudyType } = useLocalSearchParams();
  const [options, setOptions] = useState<{ id: string; text: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [shakeAnimations, setShakeAnimations] = useState<{
    [key: string]: Animated.Value;
  }>({});
  const timerCompleted = useRef(false);
  const [duration, setDuration] = useState<number>(0);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Store reference to the timer
  const timerRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      // Reset the timer whenever the screen becomes focused
      setResetKey((prev) => prev + 1);
      setShowDurationModal(true);
      const handleBackPress = () => {
        setShowDurationModal(false);
        onBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        // Clear timer when the screen is unfocused
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [onBack])
  );

  useEffect(() => {
    if (flashcards.length > 0) {
      startNewGame();
    }
  }, [resetKey]);

  const startNewGame = () => {
    if (flashcards.length === 0) return;
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    timerCompleted.current = false;
    generateOptions(flashcards[0].answer, flashcards);
    setModalVisible(false);
  };

  const generateOptions = (correctAnswer: string, allCards: Flashcard[]) => {
    let wrongAnswers = allCards
      .filter((c) => c.answer !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setOptions(
      [...wrongAnswers.map((c) => c.answer), correctAnswer]
        .sort(() => Math.random() - 0.5)
        .map((opt, i) => ({ id: String.fromCharCode(65 + i), text: opt }))
    );
  };

  useEffect(() => {
    const newAnimations: { [key: string]: Animated.Value } = {};
    options.forEach((opt) => {
      newAnimations[opt.id] = new Animated.Value(0);
    });
    setShakeAnimations(newAnimations);
  }, [options]);

  const handleAnswer = (selectedId: string | null) => {
    if (answered) return;
    setAnswered(true);
    timerCompleted.current = true;

    const correctAnswer = flashcards[currentIndex].answer;
    const selectedText = options.find((opt) => opt.id === selectedId)?.text;

    setSelectedOption(selectedId);

    if (selectedText !== correctAnswer && selectedId) {
      Vibration.vibrate(50);
      Animated.sequence([
        Animated.timing(shakeAnimations[selectedId], {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimations[selectedId], {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimations[selectedId], {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimations[selectedId], {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => moveToNextQuestion(selectedText === correctAnswer), 1500);
  };

  const handleTimeout = () => {
    if (!answered && !timerCompleted.current) {
      timerCompleted.current = true;
      handleAnswer(null);
    }
  };

  const moveToNextQuestion = (gotCorrect: boolean) => {
    if (currentIndex + 1 < flashcards.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateOptions(flashcards[nextIndex].answer, flashcards);
      setSelectedOption(null);
      setAnswered(false);
      timerCompleted.current = false;
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View className="bg-background-light flex-1">
      <Header
        onPress={() => {
          setResetKey((prev) => prev + 1);
          onBack();
        }}
        title={"Multiple Choice (Timer)"}
      />
      <Modal
        onClose={() => {
          router.back();
          setShowDurationModal(false);
        }}
        visible={showDurationModal}
        Width="96"
      >
        <TimerDuration
          durationTime={(time) => {
            setDuration(time);
            setShowDurationModal(false);
          }}
        />
      </Modal>

      <Modal
        visible={modalVisible}
        onClose={() => {}}
        Width="96"
      >
        <Result
          onTryAgain={startNewGame}
          onDone={() => {
            setModalVisible(false);
            setResetKey((prev) => prev + 1);
            onBack();
          }}
          correct={score}
          wrong={flashcards.length - score}
        />
      </Modal>

      <View className="bg-background-ligth p-4 flex-1 justify-center items-center">
        <View className="mb-4 justify-center w-full">
          {showDurationModal == false && (
            <LinearTimer
              key={resetKey}
              duration={duration}
              start={!answered}
              height={10}
              color="#005596"
              onComplete={handleTimeout}
            />
          )}
        </View>
        <View className="bg-secondary flex-1 justify-center items-center w-full rounded-2xl mb-4 p-4">
          <Text className="absolute top-0 right-0 m-4 text-sm text-primary">
            {currentIndex + 1}/{flashcards.length}
          </Text>
          <Text className="text-lg font-bold mb-4 text-primary">
            {flashcards[currentIndex].question}
          </Text>
        </View>

        {options.map((option) => {
          const isCorrect = option.text === flashcards[currentIndex].answer;
          return (
            <Animated.View
              key={option.id}
              className="w-full"
              style={[
                {
                  transform: [
                    {
                      translateX:
                        shakeAnimations[option.id] || new Animated.Value(0),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                className={`p-4 my-1 rounded-lg border-1 ${
                  answered
                    ? isCorrect
                      ? "bg-green-300 border-green-700"
                      : "bg-red-300 border-red-700"
                    : "bg-secondary/10 border-gray-300"
                }`}
                onPress={() => handleAnswer(option.id)}
                disabled={answered}
              >
                <Text className="text-base font-medium text-secondary">{`${option.id}. ${option.text}`}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <View className="mb-16"></View>
      </View>
    </View>
  );
};

export default MultipleChoice;
