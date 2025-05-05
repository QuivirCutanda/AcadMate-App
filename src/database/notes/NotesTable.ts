import * as SQLite from "expo-sqlite";
import { db } from "../database";

export async function NotesTable() {
  try {
    if (!db) throw new Error("Database connection is null");

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            tags TEXT DEFAULT NULL, 
            is_pinned INTEGER DEFAULT 0, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
        CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

        CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
        AFTER UPDATE ON notes
        FOR EACH ROW
        BEGIN
            UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
    `);

    console.log("Notes table initialized successfully");
    return db;
  } catch (error) {
    console.error("Error setting up database: Notes", error);
    return null;
  }
}
