import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MotiView } from "moti";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AddFlashCardItem from "@/src/components/flashcard/BottomSheetContent";
import {
  updateFlashcardItem,
  dbEventEmitter,
} from "@/src/database/FashcardQueries";
import CustomBottomSheet from "../../CustomBottomSheet";
import BasicReviewModal from "../BasicReview/BasicReviewModal";
import { router } from "expo-router";
interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

const shuffleArray = (array: Flashcard[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function FlashcardReview({
  flashcards,
}: {
  flashcards: Flashcard[];
}) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const [complete, setComplete] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  useEffect(() => {
    setCards(shuffleArray([...flashcards]));
  }, [flashcards, refreshKey]); // Depend on refreshKey to trigger re-fetch

  useEffect(() => {
    const handleFlashcardUpdate = (updatedFlashcard: Flashcard) => {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === updatedFlashcard.id ? updatedFlashcard : card
        )
      );
    };

    dbEventEmitter.addListener("flashcardUpdated", handleFlashcardUpdate);

    return () => {
      dbEventEmitter.removeListener("flashcardUpdated", handleFlashcardUpdate);
    };
  }, []);

  const openBottomSheet = useCallback(() => setBottomSheetVisible(true), []);
  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setQuestion("");
    setAnswer("");
  }, []);

  const UpdateCard = async () => {
    const flashcardId = Number(cards[currentIndex].id);
    const image = null;
    const audio = null;
    const success = await updateFlashcardItem(
      flashcardId,
      question,
      answer,
      image,
      audio
    );

    if (success) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === flashcardId ? { ...card, question, answer } : card
        )
      );

      dbEventEmitter.emit("flashcardUpdated", {
        id: flashcardId,
        question,
        answer,
      });
    }

    setQuestion("");
    setAnswer("");
    closeBottomSheet();
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;

    setCurrentIndex((prevIndex) => prevIndex - 1);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
    } else {
      setComplete(true);
    }
  };

  if (cards.length === 0) {
    return (
      <Text className="text-center text-lg text-red-500">
        Loading flashcards...
      </Text>
    );
  }

  const handleEdit = () => {
    setQuestion(cards[currentIndex].question);
    setAnswer(cards[currentIndex].answer);
    setBottomSheetVisible(true);
  };

  const handleRepeat = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setCurrentIndex(0);
    setIsFlipped(false);
    setComplete(false);
  };
  return (
    <View className="flex-1 justify-center items-center bg-b-ackground-ligth">
      <View>
        <BasicReviewModal
          visible={complete}
          onClose={() => setComplete(false)}
          onPressBtnLeft={handleRepeat}
          onPressBtnRight={() => {
            setComplete(false);
            handleRepeat();
            router.back();
          }}
        />
      </View>
      <View className="flex-row p-4 justify-center items-center">
        {!isFlipped ? (
          <Text className="text-lg text-secondary font-bold p-4 text-start">
            Question
          </Text>
        ) : (
          <Text className="text-lg text-secondary font-bold p-4 text-start">
            Answer
          </Text>
        )}
        <TouchableOpacity
          className="bg-secondary/70 p-2 rounded-full w-10 h-10"
          onPress={handleEdit}
        >
          <Entypo name="edit" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="flex items-center relative w-full h-[60%] px-4">
        <MotiView
          className="absolute w-full h-full justify-center items-center bg-secondary rounded-2xl shadow-lg p-4"
          style={{ backfaceVisibility: "hidden" }}
          animate={{
            rotateY: isFlipped ? "180deg" : "0deg",
            translateX: slideOut ? -300 : 0,
            opacity: slideOut ? 0 : 1,
          }}
          transition={{ type: "timing", duration: 400 }}
        >
          {!isFlipped && (
            <Text className="text-lg font-bold text-center text-primary">
              {cards[currentIndex]?.question}
            </Text>
          )}
        </MotiView>

        <MotiView
          className="absolute w-full h-full justify-center items-center bg-secondary rounded-2xl shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: [{ rotateY: "180deg" }],
          }}
          animate={{
            rotateY: isFlipped ? "0deg" : "-180deg",
            translateX: slideOut ? -300 : 0,
            opacity: slideOut ? 0 : 1,
          }}
          transition={{ type: "timing", duration: 400 }}
        >
          {isFlipped && (
            <Text className="text-lg font-bold text-center text-primary">
              {cards[currentIndex]?.answer}
            </Text>
          )}
        </MotiView>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsFlipped(!isFlipped)}
        className="my-10 mb-28 bg-secondary/10 p-4 rounded-full"
      >
        <MaterialIcons name="flip" size={32} color="#005596" />
      </TouchableOpacity>

      <View className="flex-row gap-4 absolute bottom-0 mb-8 mx-4 w-full px-4">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 py-4 rounded-2xl bg-secondary/20 flex-row items-center justify-center"
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color="#005596" />
          <Text className="text-secondary text-lg font-bold ml-2">Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 py-4 rounded-2xl bg-secondary flex-row items-center justify-center gap-2"
          onPress={handleNext}
        >
          <Text className="text-primary text-lg font-bold ml-4">Next</Text>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {bottomSheetVisible && (
        <View className="absolute w-full h-full bg-secondary/30">
          <CustomBottomSheet
            snapPoint="50%"
            isVisible={bottomSheetVisible}
            onClose={closeBottomSheet}
          >
            <AddFlashCardItem
              header="Edit Card"
              deckName={question}
              setDeckName={setQuestion}
              deckNameLabel="Question"
              deckNamePlaceholder="Enter the question"
              deckDescription={answer}
              setDeckDescription={setAnswer}
              DescriptionLabel="Answer"
              Descriptionplaceholder="Enter the answer"
              onSave={UpdateCard}
              onClose={closeBottomSheet}
            />
          </CustomBottomSheet>
        </View>
      )}
    </View>
  );
}
