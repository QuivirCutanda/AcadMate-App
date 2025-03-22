import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashcardTable } from "@/src/database/FlashcardsTable";
import Header from "@/src/components/flashcard/Header";
import Deck from "@/src/components/flashcard/Deck";

import { insertDeck,deleteDeck,getAllDecks, subscribeToDeckUpdates } from "@/src/database/FashcardQueries";

type DeckType = {
  id: number;
  title: string;
  description: string;
};

const Index = () => {
  const [decks, setDecks] = useState<DeckType[]>([]);

  // const addNewDeck = async () => {
  //   const newDeck = {
  //     userId: 1, 
  //     title: "Math Flashcards",
  //     description: "Basic math formulas and equations",
  //     isImportant: true,
  //   };

  //   const deckId = await insertDeck(newDeck);
  //   console.log("Inserted deck ID:", deckId);
  // };

  // addNewDeck();

  const removeDeck = async (deckId: number) => {
    const success = await deleteDeck(deckId);
    console.log(success ? "Deck deleted successfully" : "Failed to delete deck");
  };

  useEffect(() => {
    const fetchDecks = async () => {
      const data: any = await getAllDecks();
      if (data) setDecks(data);
    };

    fetchDecks();

    const unsubscribe = subscribeToDeckUpdates(fetchDecks);

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    FlashcardTable();
  }, []);

  return (
    <View className="flex-1 bg-background-light">
      <Header />
      <ScrollView className="flex w-full p-4 bg-background-ligth">
        {decks.map((deck) => (
          <Deck
            key={deck.id}
            title={deck.title}
            description={deck.description}
            addCard={() => console.log(`Add card to ${deck.title}`)}
            deleteDeck={() => removeDeck(deck.id)}
            editDeck={() => console.log(`Edit ${deck.title}`)}
            onPress={() => console.log(`View ${deck.title}`)}
            practice={() => console.log(`Practice ${deck.title}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Index;
