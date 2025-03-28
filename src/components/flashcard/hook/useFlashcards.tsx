import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import useBackHandler from "@/src/hooks/useBackHandler";
import {
  getAllDecks,
  getDeckID,
  insertDeck,
  updateDeck,
  deleteDeck,
  subscribeToDeckUpdates,
} from "@/src/database/FashcardQueries";

type DeckType = {
  id: number;
  title: string;
  description: string;
  totalCards: number;
  created_at: string;
};

const useFlashcardDecks = () => {
  const router = useRouter();
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [deckId, setDeckId] = useState<number | null>(null);
  const [deckName, setDeckName] = useState<string>("");
  const [deckDescription, setDeckDescription] = useState<string>("");
  const [isEditDeck, setIsEditDeck] = useState<boolean>(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarBgColor, setSnackbarBgColor] = useState<string>("black");

  useEffect(() => {
    const fetchDecks = async () => {
      const data: any = await getAllDecks();
      if (data && Array.isArray(data)) {
        const sortedDecks = [...data].sort((a, b) =>
          sortOrder === "asc"
            ? a.created_at.localeCompare(b.created_at)
            : b.created_at.localeCompare(a.created_at)
        );
        setDecks(sortedDecks);
      }
    };

    fetchDecks();
    const unsubscribe = subscribeToDeckUpdates(fetchDecks);
    return () => unsubscribe();
  }, [sortOrder]);

  const openBottomSheet = useCallback(() => {
    setBottomSheetVisible(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setDeckName("");
    setDeckDescription("");
    setIsEditDeck(false);
  }, []);

  useBackHandler(() => {
    if (isBottomSheetVisible) {
      closeBottomSheet();
      return true;
    }
    router.back();
    return true;
  });

  const addNewDeck = async () => {
    if (!deckName.trim()) {
      console.warn("Deck name is required.");
      return;
    }
    const newDeck = { userId: 1, title: deckName, description: deckDescription, isImportant: false };
    const deckId = await insertDeck(newDeck);
    setSnackbarVisible(true);
    setSnackbarMessage("Deck added successfully");
    setSnackbarBgColor("green");
    closeBottomSheet();
  };

  const updateDeckHandler = async (deckId: number) => {
    const update = { userId: 1, title: deckName, description: deckDescription, isImportant: false };
    const success = await updateDeck(deckId, update);
    if (success) {
      setSnackbarVisible(true);
      setSnackbarMessage("Deck updated successfully");
      setSnackbarBgColor("green");
    } else {
      setSnackbarVisible(true);
      setSnackbarMessage("Failed to update the deck");
      setSnackbarBgColor("red");
    }
    closeBottomSheet();
  };

  const getDeckByID = async (deckID: number) => {
    const data: any = await getDeckID(deckID);
    if (data?.length > 0) {
      setDeckName(data[0].title);
      setDeckDescription(data[0].description);
      setIsEditDeck(true);
      setDeckId(deckID);
      openBottomSheet();
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

  return {
    decks,
    deckName,
    deckDescription,
    isBottomSheetVisible,
    snackbarVisible,
    snackbarMessage,
    snackbarBgColor,
    sortOrder,
    setSortOrder,
    addNewDeck,
    updateDeckHandler,
    getDeckByID,
    removeDeck,
    openBottomSheet,
    closeBottomSheet,
    setDeckName,
    setDeckDescription,
  };
};

export default useFlashcardDecks;
