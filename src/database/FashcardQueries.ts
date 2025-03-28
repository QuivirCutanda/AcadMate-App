import { db } from "./database";
import { EventEmitter } from "events";

interface Deck {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  isImportant: boolean;
}

interface DeckWithTotalCards extends Deck {
  totalCards: number;
}

export const dbEventEmitter = new EventEmitter();

//insert Deck
export const insertDeck = async (deck: Deck): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT INTO decks (user_id, title, description, is_important) VALUES (?, ?, ?, ?)",
      [
        deck.userId,
        deck.title,
        deck.description || "",
        deck.isImportant ? 1 : 0,
      ]
    );

    console.log(
      `Deck inserted successfully with ID: ${result.lastInsertRowId}`
    );

    dbEventEmitter.emit("decksUpdated");

    return result.lastInsertRowId ?? null;
  } catch (error) {
    console.error("Error inserting deck:", error);
    return null;
  }
};

//update Deck
export const updateDeck = async (
  deckId: number,
  deck: Deck
): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "UPDATE decks SET title = ?, description = ?, is_important = ? WHERE id = ?",
      [deck.title, deck.description || "", deck.isImportant ? 1 : 0, deckId]
    );

    console.log(`Deck updated successfully with ID: ${deckId}`);

    dbEventEmitter.emit("decksUpdated");

    return result.changes > 0;
  } catch (error) {
    console.error("Error updating deck:", error);
    return false;
  }
};

//get Deck by ID
export const getDeckID = async (deckId: number): Promise<Deck[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results = await db.getAllAsync("SELECT * FROM decks WHERE id = ?", [
      deckId,
    ]);

    return results.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      isImportant: row.is_important === 1,
      created_at: row.created_at,
    }));
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
};

//get All Deck
export const getAllDecks = async (): Promise<DeckWithTotalCards[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    // Fetch all decks
    const results: any[] = await db.getAllAsync("SELECT * FROM decks");

    if (!results.length) return null;

    // Map through decks and count flashcards asynchronously
    const decksWithTotalCards: DeckWithTotalCards[] = await Promise.all(
      results.map(async (row: any) => {
        if (!db) throw new Error("Database connection is null");

        // Fetch total cards count asynchronously
        const cardCountResult: any[] = await db.getAllAsync(
          "SELECT COUNT(*) as totalCards FROM flashcards WHERE deck_id = ?",
          [row.id]
        );

        return {
          id: row.id,
          userId: row.user_id,
          title: row.title,
          description: row.description,
          isImportant: row.is_important === 1,
          created_at: row.created_at,
          totalCards: cardCountResult?.[0]?.totalCards || 0, // Fix: Properly access count
        };
      })
    );

    return decksWithTotalCards;
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
};


//Delete Deck
export const deleteDeck = async (deckId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync("DELETE FROM decks WHERE id = ?", [
      deckId,
    ]);

    if (result.changes > 0) {
      console.log(`Deck deleted successfully with ID: ${deckId}`);
      dbEventEmitter.emit("decksUpdated");
      return true;
    } else {
      console.log(`Deck with ID: ${deckId} not found.`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting deck:", error);
    return false;
  }
};

//insertFlashcard
export const insertFlashcardItem = async (
  deckId: number,
  question: string,
  answer: string,
  image?: Uint8Array | null,
  audio?: Uint8Array | null
): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    await db.runAsync(
      `INSERT INTO flashcards (deck_id, question, answer, image, audio) VALUES (?, ?, ?, ?, ?)`,
      [deckId, question, answer, image || null, audio || null]
    );

    dbEventEmitter.emit("flashcardsUpdated", deckId);
    return true;
  } catch (error) {
    console.error("Error inserting flashcard:", error);
    return false;
  }
};


//update flashcardItem
export const updateFlashcardItem = async (
  flashcardId: number,
  question: string,
  answer: string,
  image?: Uint8Array | null,
  audio?: Uint8Array | null
): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    await db.runAsync(
      `UPDATE flashcards 
       SET question = ?, answer = ?, image = ?, audio = ? 
       WHERE id = ?`,
      [question, answer, image || null, audio || null, flashcardId]
    );

    dbEventEmitter.emit("flashcardsUpdated");
    return true;
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return false;
  }
};



//getFlashcardsByDeck
export const getFlashcardsByDeck = async (
  deckId: number
): Promise<{ id: number; question: string; answer: string }[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results: any[] = await db.getAllAsync(
      "SELECT id, question, answer FROM flashcards WHERE deck_id = ?",
      [deckId]
    );

    if (!results.length) return null;

    return results.map((row: any) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
    }));
  } catch (error) {
    console.error("Error fetching flashcards for deck:", error);
    return null;
  }
};

//deleteFlashcardItem
export const deleteFlashcardItem = async (flashcardId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    await db.runAsync(`DELETE FROM flashcards WHERE id = ?`, [flashcardId]);

    dbEventEmitter.emit("flashcardsUpdated");
    return true;
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return false;
  }
};

export const subscribeToDeckUpdates = (callback: () => void) => {
  dbEventEmitter.on("decksUpdated", callback);

  return () => {
    dbEventEmitter.off("decksUpdated", callback);
  };
};
