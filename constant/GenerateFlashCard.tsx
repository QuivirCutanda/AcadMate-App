import periodicTableData from "./data/periodicTable.json";
import { insertDeck, insertFlashcardItem } from "@/src/database/FashcardQueries";

export const insertPeriodicTableDeck = async () => {
  try {
    const deckId = await insertDeck({
      userId: 1,
      title: periodicTableData.deckName,
      description: periodicTableData.description,
      isImportant: false,
    });

    if (!deckId) {
      console.error("Failed to insert the deck.");
      return;
    }

    for (const flashcard of periodicTableData.flashcards) {
      const success = await insertFlashcardItem(
        deckId,
        flashcard.question,
        flashcard.answer
      );
      
      if (!success) {
        console.error(`Failed to insert flashcard: ${flashcard.question}`);
      }
    }

    console.log("Periodic Table Mastery deck inserted successfully!");
  } catch (error) {
    console.error("Error inserting Periodic Table deck:", error);
  }
};
