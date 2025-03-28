import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";

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
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

const FlashcardItem = () => {
  const router = useRouter();
  const { deckId } =   useLocalSearchParams();

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
  const [loading, setLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const openBottomSheet = useCallback(() => setBottomSheetVisible(true), []);
  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false)
    setQuestion("");
    setAnswer(""); 
  }, []);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true)
    }, [])
  );
  
  useBackHandler(() => {
    if (bottomSheetVisible) {
      closeBottomSheet();
      return true;
    }
    setBottomSheetVisible(false);
    router.back();
    return true;
  });

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
    setQuestion("")
    setAnswer("")
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
       <EmptyBox/>
      ),
    [cardItem, openBottomSheet]
  );

  const handleSelectOption = (key: string) => {
    console.log(key);
    switch (key) {
      case "manualEntry":
        setMenuVisible(false);
        setCardUpdate(false)
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
  return (
    <View className="flex-1 bg-background-light">
      <Header onPress={router.back} />
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
              onSave={() => {
                cardUpdate ==true ? UpdateCard() : addFlashcard();
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
