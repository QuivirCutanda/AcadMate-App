import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, ScrollView, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import Header from "@/src/components/flashcard/Header";
import CardItem from "@/src/components/flashcard/CardItem";
import CustomBottomSheet from "@/src/components/CustomBottomSheet";
import AddFlashCardItem from "@/src/components/flashcard/BottomSheetContent";
import MenuItem from "@/src/components/flashcard/MenuItem";
import Button from "@/src/components/flashcard/NewDeckButton";
import DeckModal from "@/src/components/flashcard/DeckModal";
import Snackbar from "@/src/components/CustomSnackbar";
import useBackHandler from "@/src/hooks/useBackHandler";
import EmptyBox from "@/src/components/flashcard/EmptyFlashCard";
import {
  insertFlashcardItem,
  getFlashcardsByDeck,
  deleteFlashcardItem,
  updateFlashcardItem,
  dbEventEmitter,
} from "@/src/database/FashcardQueries";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import ActionButton from "@/src/components/flashcard/ActionButton";
import StudyModal from "@/src/components/flashcard/StudyModal";
import AnimatedModal from "@/src/components/AnimatedModal";

const FlashcardItem = () => {
  const router = useRouter();
  const { deckId } = useLocalSearchParams();

  const [cardId, setCardId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [cardUpdate, setCardUpdate] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarBgColor, setSnackbarBgColor] = useState<string>("black");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cardItem, setCardItem] = useState<
    { id: number; question: string; answer: string }[] | null
  >(null);
  const [containCards, setContainCards] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [studyModalBisble, setStudyModalBisble] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);

  const openBottomSheet = useCallback(() => setBottomSheetVisible(true), []);
  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setQuestion("");
    setAnswer("");
  }, []);

  useBackHandler(() => {
    if (bottomSheetVisible) {
      closeBottomSheet();
      return true;
    }
    setBottomSheetVisible(false);
    router.back();
    return true;
  });

  useEffect(() => {
    setContainCards(cardItem?.length ?? 0);
  }, [cardItem]);

  const addFlashcard = async () => {
    if (!question.trim() || !answer.trim()) {
      return Alert.alert("Error", "Both question and answer are required!");
    }
    const success = await insertFlashcardItem(Number(deckId), question, answer);
    if (success) {
      setSnackbarVisible(true);
      setSnackbarMessage("Card added successfully");
      setSnackbarBgColor("green");
    } else {
      Alert.alert("Error", "Failed to add flashcard.");
    }
    setQuestion("");
    setAnswer("");
  };

  const UpdateCard = async () => {
    const flashcardId = Number(cardId);
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
      setSnackbarVisible(true);
      setSnackbarMessage("Card updated");
      setSnackbarBgColor("green");
      closeBottomSheet();
    } else {
      setSnackbarVisible(true);
      setSnackbarMessage("Failed to updated");
      setSnackbarBgColor("red");
      closeBottomSheet();
    }
    setQuestion("");
    setAnswer("");
  };

  const DeleteCard = async (cardId: number | null) => {
    if (cardId == null) return;
    const success = await deleteFlashcardItem(cardId);
    if (success) {
      setSnackbarVisible(true);
      setSnackbarMessage("Card removed");
      setSnackbarBgColor("red");
      closeBottomSheet();
    } else {
      closeBottomSheet();
      setSnackbarVisible(true);
      setSnackbarMessage("Card failed to Removed");
      setSnackbarBgColor("red");
    }
  };

  const fetchFlashcards = useCallback(async () => {
    if (!deckId) return;
    const data = await getFlashcardsByDeck(Number(deckId));
    setCardItem(data);
    setLoading(false);
  }, [deckId]);

  useEffect(() => {
    fetchFlashcards();
    const handleFlashcardsUpdated = fetchFlashcards;
    dbEventEmitter.on("flashcardsUpdated", handleFlashcardsUpdated);

    return () => {
      dbEventEmitter.off("flashcardsUpdated", handleFlashcardsUpdated);
    };
  }, [fetchFlashcards]);

  const flashcardList = useMemo(
    () =>
      cardItem?.length ? (
        cardItem.map((item, index) => (
          <View
            className={`${cardItem.length - 1 == index && "mb-20"}`}
            key={item.id}
          >
            <CardItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              onPress={() => {
                setCardId(item.id);
                setQuestion(item.question);
                setAnswer(item.answer);
                setMenuVisible(true);
                openBottomSheet();
              }}
            />
          </View>
        ))
      ) : (
        <EmptyBox />
      ),
    [cardItem, openBottomSheet]
  );

  const handleSelectOption = (key: string) => {
    console.log(key);
    switch (key) {
      case "manualEntry":
        setMenuVisible(false);
        setCardUpdate(false);
        openBottomSheet();
        console.log("Manual Entry");
        break;
      case "importPDF":
        console.log("Import PDF");
        break;
      case "importDocs":
        console.log("Import Docs");
        break;
      case "scanImage":
        console.log("Scan Image");
        break;
    }
    setModalVisible(false);
  };

  const handleStudyOption = (key: string) => {
    switch (key) {
      case "BasicReview":
        containCards > 0
          ? (setStudyModalBisble(false),
            router.push(`/StudyScreen`),
            router.setParams({ deckId: deckId, StudyType: key }))
          : (setStudyModalBisble(false), setWarningVisible(true));
        break;
      case "MultipleChoice":
        if (containCards > 4) {
          setStudyModalBisble(false);
          router.push(`/QuizScreen`);
          router.setParams({ deckId: deckId, StudyType: key });
          console.log("MultipleChoice");
        } else {
          setStudyModalBisble(false), setWarningVisible(true);
        }
        break;
      case "MultipleChoiceTimer":
        if (containCards >= 4) {
          setStudyModalBisble(false);
          router.push(`/QuizScreen`);
          router.setParams({ deckId: deckId, StudyType: key });
          console.log("MultipleChoice");
        } else {
          setStudyModalBisble(false), setWarningVisible(true);
        }
        break;
      case "WritingReview":
        setStudyModalBisble(false);
        router.push(`/StudyScreen`);
        router.setParams({ deckId: deckId, StudyType: key });
        console.log("WritingReview");
        break;
    }
  };
  return (
    <View className="flex-1 bg-background-light">
      <View>
        <AnimatedModal
          visible={warningVisible}
          onClose={() => setWarningVisible(false)}
        >
          <Ionicons name="warning" size={60} color="#eab308" />
          {containCards <= 0 && (
            <Text className="text-yellow-500 text-lg font-bold text-center">
              No Cards Available
            </Text>
          )}
          {containCards > 0 && containCards < 4 && (
            <Text className="text-yellow-500 text-lg font-bold text-center">
              Add at least 4 cards to use this feature.
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setWarningVisible(false);
              setMenuVisible(false);
              setCardUpdate(false);
              openBottomSheet();
            }}
            className="w-full p-4 mt-4 bg-secondary rounded-2xl"
          >
            <Text className="text-primary font-normal text-center">
              Add Card
            </Text>
          </TouchableOpacity>
        </AnimatedModal>
      </View>

      <Header onPress={router.back} title="Flash Card" />
      <View className="w-44 mt-4 self-end mr-4">
        <ActionButton
          onPress={() => {
            setStudyModalBisble(true);
          }}
          icon={<MaterialIcons name="menu-book" size={24} color="#FFFFFF" />}
          text="Study Now"
        />
      </View>
      <ScrollView className="pt-4">{flashcardList}</ScrollView>
      <Button
        onPress={() => setModalVisible(true)}
        className={`${modalVisible ? "opacity-0" : "opacity-100"}`}
      />
      <View
        className={`flex-1 absolute h-full w-full ${
          bottomSheetVisible && "bg-secondary/30 backdrop-blur"
        }`}
      >
        <CustomBottomSheet
          snapPoint={`${menuVisible ? "20%" : "50%"}`}
          isVisible={bottomSheetVisible}
          onClose={closeBottomSheet}
        >
          {menuVisible ? (
            <View className="p-4">
              <MenuItem
                label="Edit"
                Icon={Entypo}
                iconName="edit"
                iconColor="#005596"
                onPress={() => {
                  setMenuVisible(false);
                  setCardUpdate(true);
                  openBottomSheet();
                }}
              />
              <MenuItem
                label="Remove"
                Icon={FontAwesome5}
                iconName="trash"
                iconColor="#ef4444"
                textColor="text-red-500"
                onPress={() => DeleteCard(cardId)}
              />
            </View>
          ) : (
            <AddFlashCardItem
              header="Add Card"
              deckName={question}
              setDeckName={setQuestion}
              deckNameLabel="Question"
              deckDescription={answer}
              setDeckDescription={setAnswer}
              deckNamePlaceholder="Enter Question"
              DescriptionLabel="Answer"
              Descriptionplaceholder="Enter Answer"
              onClose={closeBottomSheet}
              DescriptionRequired={true}
              onSave={() => {
                cardUpdate == true ? UpdateCard() : addFlashcard();
              }}
            />
          )}
        </CustomBottomSheet>
      </View>
      <View>
        <DeckModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedOption={(key: string) => {
            handleSelectOption(key);
          }}
        />
        <StudyModal
          visible={studyModalBisble}
          onClose={() => setStudyModalBisble(false)}
          selectedOption={(key: string) => {
            handleStudyOption(key);
          }}
        />
      </View>
      <Snackbar
        message={snackbarMessage}
        visible={snackbarVisible}
        backgroundColor={snackbarBgColor}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
};

export default FlashcardItem;
