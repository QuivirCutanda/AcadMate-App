import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  Layout,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Header from "@/src/components/flashcard/Header";
import Deck from "@/src/components/flashcard/Deck";
import CustomBottomSheet from "@/src/components/CustomBottomSheet";
import Snackbar from "@/src/components/CustomSnackbar";
import AddNewDeck from "@/src/components/flashcard/BottomSheetContent";
import { useScroll } from "@/components/ScrollContext";
import useBackHandler from "@/src/hooks/useBackHandler";
import { useFocusEffect, useRouter, useSegments } from "expo-router";
import Button from "@/src/components/flashcard/NewDeckButton";
import DeckModal from "@/src/components/flashcard/DeckModal";
import StudyModal from "@/src/components/flashcard/StudyModal";
import EmptyBox from "@/src/components/flashcard/EmptyFlashCard";
import AnimatedModal from "@/src/components/AnimatedModal";

import {
  deleteDeck,
  getAllDecks,
  getDeckID,
  insertDeck,
  subscribeToDeckUpdates,
  updateDeck,
} from "@/src/database/FashcardQueries";

type DeckType = {
  id: number;
  title: string;
  description: string;
  totalCards: number;
  created_at: string;
};

const Index = () => {
  const router = useRouter();
  const { scrollHandler } = useScroll();
  const segments: string[] = useSegments();

  const [modalVisible, setModalVisible] = useState(false);
  const [warningVisble, setWarningVisble] = useState(false);

  const [studyModalBisble, setStudyModalBisble] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarBgColor, setSnackbarBgColor] = useState<string>("black");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDecks, setFilteredDecks] = useState<DeckType[]>([]);
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [deckId, setDeckId] = useState<number | null>(null);
  const [containCards,setContainCards] = useState(false);
  const [deckName, setDeckName] = useState<string>("");

  const [deckDescription, setDeckDescription] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isEditDeck, setIsEditDeck] = useState<boolean>(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const hiddenSegments = ["(flashcard)"];
    const shouldHideTabBar = segments.some((segment) =>
      hiddenSegments.includes(segment)
    );
    shouldHideTabBar ? setVisible(true) : setVisible(false);
  }, [segments]);

  console.log(router);
  const openBottomSheet = useCallback(() => {
    setVisible(false);
    setBottomSheetVisible(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setVisible(true);
    setDeckName("");
    setDeckDescription("");
  }, []);

  useBackHandler(() => {
    if (isBottomSheetVisible) {
      closeBottomSheet();
      return true;
    }
    setBottomSheetVisible(false);
    setVisible(false);
    router.back();
    return true;
  });

  const addNewDeck = async () => {
    if (!deckName.trim()) {
      console.warn("Deck name is required.");
      return;
    }
    const newDeck = {
      userId: 1,
      title: deckName,
      description: deckDescription,
      isImportant: false,
    };

    const deckId = await insertDeck(newDeck);
    console.log("Inserted deck ID:", deckId);
    setSnackbarVisible(true);
    setSnackbarMessage("Deck added successfully");
    setSnackbarBgColor("green");
    setVisible(true);
    closeBottomSheet();
    setDeckName("");
    setDeckDescription("");
  };

  const updateDeckHandler = async (deckId: number) => {
    const update = {
      userId: 1,
      title: deckName,
      description: deckDescription,
      isImportant: false,
    };

    const success = await updateDeck(deckId, update);
    setVisible(true);
    closeBottomSheet();
    setDeckName("");
    setDeckDescription("");
    if (success) {
      setSnackbarVisible(true);
      setSnackbarMessage("Deck updated successfully");
      setSnackbarBgColor("green");
      console.log("Deck updated successfully.");
    } else {
      setSnackbarVisible(true);
      setSnackbarMessage("Failed to update the deck");
      setSnackbarBgColor("red");
      console.log("Failed to update the deck.");
    }
  };

  const getDeckByID = async (deckID: number) => {
    const data: any = await getDeckID(deckID);
    if (data && data.length > 0) {
      setDeckName(data[0].title);
      setDeckDescription(data[0].description);
      setVisible(true);
      openBottomSheet();
    } else {
      console.warn("Deck not found.");
    }
  };

  const removeDeck = async (deckId: number) => {
    const success = await deleteDeck(deckId);
    setSnackbarVisible(true);

    if (success) {
      setSnackbarMessage("Deck deleted successfully");
      setSnackbarBgColor("red");
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
    } else {
      setSnackbarMessage("Failed to delete deck");
      setSnackbarBgColor("red");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredDecks(decks);
    } else {
      const filtered = decks.filter((deck) =>
        deck.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDecks(filtered);
    }
  };

  const fetchDecks = async () => {
    const data: any = await getAllDecks();
    console.log("Fetched Decks:", data);

    if (data && Array.isArray(data)) {
      const sortedDecks = [...data].sort((a, b) =>
        sortOrder === "asc"
          ? a.created_at.localeCompare(b.created_at)
          : b.created_at.localeCompare(a.created_at)
      );
      setDecks(sortedDecks);
      setFilteredDecks(sortedDecks);
    } else {
      console.log("No decks found or invalid data structure.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [sortOrder])
  );

  useEffect(() => {
    const unsubscribe = subscribeToDeckUpdates(fetchDecks);
    return () => unsubscribe();
  }, [sortOrder]);

  const handleSelectOption = (key: string) => {
    console.log(key);
    switch (key) {
      case "manualEntry":
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
        containCards === true ? (
          setStudyModalBisble(false),
          router.push(`/StudyScreen`),
          router.setParams({ deckId: deckId, StudyType: key })
        ) : (
          setStudyModalBisble(false),
          setWarningVisble(true)
        );
        break;
      case "MultipleChoice":
        setStudyModalBisble(false)
        router.push(`/StudyScreen`);
        router.setParams({ deckId: deckId,StudyType:key });
        console.log("MultipleChoice");
        break;
      case "MultipleChoiceTimer":
        setStudyModalBisble(false)
        router.push(`/StudyScreen`);
        router.setParams({ deckId: deckId,StudyType:key });
        console.log("MultipleChoiceTimer");
        break;
      case "WritingReview":
        setStudyModalBisble(false)
        router.push(`/StudyScreen`);
        router.setParams({ deckId: deckId,StudyType:key });
        console.log("WritingReview");
        break;
    }
  };
  return (
    <GestureHandlerRootView className="flex-1 bg-background-ligth">
      <View className="flex-1 bg-background-light">
        <Header
          onPress={() => {
            if (isBottomSheetVisible) {
              closeBottomSheet();
              return true;
            }
            setVisible(false);
            router.back();
          }}
          title="Flash Card"
        />

        <View className="px-4 mt-2">
          {/* Sort Button */}
          {decks.length > 0 && (
            <View className="flex-row justify-between items-center">
              <Animated.View>
                <TouchableOpacity
                  className="flex-row items-center bg-secondary px-4 py-2 rounded-lg"
                  onPress={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  <Text className="text-white font-bold mr-2">
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </Text>
                  <Entypo
                    name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          className="flex w-full p-4 bg-background-light"
        >
          {decks.length > 0 ? (
            decks.map((deck, index) => (
              <Animated.View
                key={deck.id}
                entering={
                  index % 2 === 0
                    ? SlideInLeft.delay(index * 100)
                    : SlideInRight.delay(index * 100)
                }
                layout={Layout.springify()}
                className={`flex-1 ${
                  decks.length - 1 === index ? "mb-28" : ""
                }`}
              >
                <Deck
                  title={deck.title}
                  description={deck.description}
                  totalCards={deck.totalCards}
                  addCard={() => {
                    router.push(`/FlashcardItem`);
                    router.setParams({ deckId: deck.id });
                  }}
                  deleteDeck={() => removeDeck(deck.id)}
                  editDeck={() => {
                    getDeckByID(deck.id);
                    setIsEditDeck(true);
                    setDeckId(deck.id);
                  }}
                  practice={() => {
                    setContainCards(deck.totalCards>0);
                    setDeckId(deck.id);
                    setStudyModalBisble(true);
                  }}
                />
              </Animated.View>
            ))
          ) : (
            <EmptyBox />
          )}
        </Animated.ScrollView>

        <View className="absolute bottom-0 right-0 left-0 mb-20 flex justify-center items-center m-2 z-0">
          <Snackbar
            message={snackbarMessage}
            visible={snackbarVisible}
            backgroundColor={snackbarBgColor}
            onDismiss={() => setSnackbarVisible(false)}
          />
        </View>
        <View
          className={`flex-1 absolute h-full w-full ${
            !visible && "bg-secondary/30 backdrop-blur"
          }`}
        >
          <Button
            onPress={() => setModalVisible(true)}
            className={`${modalVisible ? "opacity-0" : "opacity-100"}`}
          />
          <CustomBottomSheet
            isVisible={isBottomSheetVisible}
            onClose={closeBottomSheet}
            snapPoint="50%"
          >
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

            <AnimatedModal
              visible={warningVisble}
              onClose={() => setWarningVisble(false)}
            >
              <Ionicons name="warning" size={60} color="#eab308" />
              <Text className="text-yellow-500 text-lg font-bold">No Cards Available</Text>
              <TouchableOpacity
              activeOpacity={0.7}
              onPress={()=>{
                setWarningVisble(false)
                router.push(`/FlashcardItem`);
                router.setParams({ deckId: deckId });
              }}
              className="w-full p-4 mt-4 bg-secondary rounded-2xl"
              >
                <Text className="text-primary font-normal text-center">Add Card</Text>
              </TouchableOpacity>
            </AnimatedModal>  

            <AddNewDeck
              header="Create a Flashcard"
              deckName={deckName}
              deckNameLabel="Card Name"
              deckNamePlaceholder="Enter Card Name"
              DescriptionLabel="Description - (Optional)"
              Descriptionplaceholder="Enter Description"
              setDeckName={setDeckName}
              deckDescription={deckDescription}
              setDeckDescription={setDeckDescription}
              onClose={closeBottomSheet}
              onSave={() => {
                if (isEditDeck) {
                  if (deckId !== null && deckId !== undefined) {
                    updateDeckHandler(deckId);
                    setIsEditDeck(false);
                  }
                } else {
                  addNewDeck();
                }
              }}
            />
          </CustomBottomSheet>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;
