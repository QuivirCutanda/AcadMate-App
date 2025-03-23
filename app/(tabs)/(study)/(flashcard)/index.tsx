import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  Layout,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import FabGroup from "@/src/components/CustomFabGroup";
import Header from "@/src/components/flashcard/Header";
import Deck from "@/src/components/flashcard/Deck";
import CustomBottomSheet from "@/src/components/CustomBottomSheet";
import Snackbar from "@/src/components/CustomSnackbar";
import AddNewDeck from "@/src/components/flashcard/BottomSheetContent";
import { useScroll } from "@/components/ScrollContext";
import useBackHandler from "@/src/hooks/useBackHandler";
import { useRouter, useSegments } from "expo-router";
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

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarBgColor, setSnackbarBgColor] = useState<string>("black");

  const [decks, setDecks] = useState<DeckType[]>([]);
  const [deckId, setDeckId] = useState<number | null>();
  const [deckName, setDeckName] = useState<string>("");
  const [deckDescription, setDeckDescription] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isEditDeck, setIsEditDeck] = useState<boolean>(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const hiddenSegments = ["(flashcard)"];
    const shouldHideTabBar = segments.some((segment) =>
      hiddenSegments.includes(segment)
    );
    shouldHideTabBar && setVisible(false);
  }, [segments]);

  console.log(router);
  const openBottomSheet = useCallback(() => {
    setBottomSheetVisible(true);
    setVisible(true);
  }, []);

  const closeBottomSheet = useCallback(async () => {
    await setBottomSheetVisible(false);
    await setVisible(false);
    setDeckName("");
    setDeckDescription("");
  }, []);

  useBackHandler(() => {
    setVisible(true);
    setBottomSheetVisible(false);
    router.back();
    return true;
  });

  const addNewDeck = async () => {
    if (!deckName.trim()) {
      console.log("Deck name is required.");
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
    closeBottomSheet();
    setVisible(true);
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
    closeBottomSheet();
    setVisible(true);
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
    console.log("Get Deck by ID :", data);
    setDeckName(data[0].title);
    setDeckDescription(data[0].description);
    setVisible(true);
    openBottomSheet();
  };

  const removeDeck = async (deckId: number) => {
    const success = await deleteDeck(deckId);
    if(success){
      setSnackbarVisible(true);
      setSnackbarMessage("Deck deleted successfully");
      setSnackbarBgColor("green");
    }else{
      setSnackbarVisible(true);
      setSnackbarMessage("Failed to delete deck");
      setSnackbarBgColor("red");
      setSnackbarMessage("Failed to delete deck");
    }
  };

  useEffect(() => {
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
      } else {
        console.log("No decks found or invalid data structure.");
      }
    };

    fetchDecks();
    const unsubscribe = subscribeToDeckUpdates(fetchDecks);
    return () => unsubscribe();
  }, [sortOrder]);

  const actions = [
    {
      icon: "file-import",
      label: "Import",
      onPress: () => console.log("Edit Clicked"),
    },
    {
      icon: "file",
      label: "Upload Docs",
      onPress: () => console.log("Delete Clicked"),
    },
    { icon: "plus", label: "New Deck", onPress: openBottomSheet },
  ];

  return (
    <GestureHandlerRootView className="flex-1 ">
      <View className="flex-1 bg-background-light">
        <Header
          onPress={() => {
            setVisible(true);
            router.back();
          }}
        />

        {/* Sorting Button with Animation */}
        <View className="flex-row justify-between items-center px-4 mt-2 ">
          <Text className="text-lg font-bold">Sort by Time:</Text>

          <Animated.View>
            <TouchableOpacity
              className="flex-row items-center bg-secondary px-4 py-2 rounded-lg"
              onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
                  sortOrder === "asc"
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
                  addCard={openBottomSheet}
                  deleteDeck={() => removeDeck(deck.id)}
                  editDeck={() => {
                    getDeckByID(deck.id);
                    setIsEditDeck(true);
                    setDeckId(deck.id);
                  }}
                  onPress={() => console.log(`View ${deck.title}`)}
                  practice={() => console.log(`Practice ${deck.title}`)}
                />
              </Animated.View>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              No decks available. Add a new one!
            </Text>
          )}
        </Animated.ScrollView>

        <FabGroup actions={actions} visible={visible} />

        <CustomBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}
        >
          <AddNewDeck
            deckName={deckName}
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
       <View className="absolute bottom-0 right-0 left-0 mb-20 flex justify-center items-center">
       <Snackbar 
        message={snackbarMessage}
        visible={snackbarVisible}
        backgroundColor={snackbarBgColor}
        onDismiss={()=>setSnackbarVisible(false)}
        />
       </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;
