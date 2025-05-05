import * as SQLite from "expo-sqlite";
import { db } from "./database";
export const FlashcardTable = async () => {
  try {
    if (!db) throw new Error("Database connection is null");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        is_important BOOLEAN DEFAULT 0, -- 1 = Important, 0 = Normal
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        image BLOB, -- Optional image
        audio BLOB, -- Optional audio
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        flashcard_id INTEGER NOT NULL,
        last_reviewed DATETIME DEFAULT CURRENT_TIMESTAMP,
        next_review DATETIME, -- Next recommended review time
        review_count INTEGER DEFAULT 0, -- How many times reviewed
        correct_attempts INTEGER DEFAULT 0, -- Correct answers count
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS flashcard_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flashcard_id INTEGER NOT NULL,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
      );

    `);

    console.log("Flashcard tables initialized successfully");
    return db;
  } catch (error) {
    console.error("Error setting up database:", error);
    return null;
  }
};

