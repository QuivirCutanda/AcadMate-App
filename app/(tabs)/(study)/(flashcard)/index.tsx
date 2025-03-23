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
import AddNewDeck from "@/src/components/flashcard/BottomSheetContent";
import { FlashcardTable } from "@/src/database/FlashcardsTable";
import { useScroll } from "@/components/ScrollContext";
import {
  deleteDeck,
  getAllDecks,
  insertDeck,
  subscribeToDeckUpdates,
} from "@/src/database/FashcardQueries";

type DeckType = {
  id: number;
  title: string;
  description: string;
};

const Index = () => {
  const { scrollHandler } = useScroll();
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [deckName, setDeckName] = useState<string>("");
  const [deckDescription, setDeckDescription] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    FlashcardTable();
    console.log("Flashcard table initialized.");
  }, []);

  const openBottomSheet = useCallback(() => {
    setBottomSheetVisible(true);
    setVisible(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setVisible(false);
  }, []);

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

    closeBottomSheet();
    setVisible(true);
    setDeckName("");
    setDeckDescription("");
  };

  const removeDeck = async (deckId: number) => {
    const success = await deleteDeck(deckId);
    console.log(
      success ? "Deck deleted successfully" : "Failed to delete deck"
    );
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
      icon: "robot",
      label: "AI",
      onPress: () => console.log("Delete Clicked"),
    },
    { icon: "plus", label: "New Deck", onPress: openBottomSheet },
  ];

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-background-light">
        <Header />

        {/* Sorting Button with Animation */}
        <View className="flex-row justify-between items-center px-4 mt-2">
          <Text className="text-lg font-bold">Sort by Title:</Text>

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
                  addCard={openBottomSheet}
                  deleteDeck={() => removeDeck(deck.id)}
                  editDeck={() => console.log(`Edit ${deck.title}`)}
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
            onSave={addNewDeck}
          />
        </CustomBottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;
