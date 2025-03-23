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

const dbEventEmitter = new EventEmitter();

//insert Deck
export const insertDeck = async (deck: Deck): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT INTO decks (user_id, title, description, is_important) VALUES (?, ?, ?, ?)",
      [deck.userId, deck.title, deck.description || "", deck.isImportant ? 1 : 0]
    );

    console.log(`Deck inserted successfully with ID: ${result.lastInsertRowId}`);

    dbEventEmitter.emit("decksUpdated");

    return result.lastInsertRowId ?? null;
  } catch (error) {
    console.error("Error inserting deck:", error);
    return null;
  }
};

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

  
//update Deck
export const updateDeck = async (deckId: number, deck: Deck): Promise<boolean> => {
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
export const getDeckID = async (deckId:number): Promise<Deck[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results = await db.getAllAsync("SELECT * FROM decks WHERE id = ?",[deckId]);

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

    const results: any[] = await db.getAllAsync("SELECT * FROM decks");

    if (!results.length) return null;

    const decksWithTotalCards: DeckWithTotalCards[] = await Promise.all(
      results.map(async (row: any) => {
        if (!db) throw new Error("Database connection is null");

        const cardCountResult: any = db.getAllSync(
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
          totalCards: cardCountResult?.totalCards || 0, 
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
  
      const result = await db.runAsync("DELETE FROM decks WHERE id = ?", [deckId]);
  
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

  
export const subscribeToDeckUpdates = (callback: () => void) => {
  dbEventEmitter.on("decksUpdated", callback);

  return () => {
    dbEventEmitter.off("decksUpdated", callback);
  };
};
