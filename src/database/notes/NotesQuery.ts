import { db } from "../database";
import { EventEmitter } from "events";

interface Note {
  id?: number;
  userId: number;
  title: string;
  content: string;
  tags?: string;
  isPinned?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const dbEventEmitter = new EventEmitter();

// **Insert Note**
export const insertNote = async (note: Note): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT INTO notes (user_id, title, content, tags, is_pinned) VALUES (?, ?, ?, ?, ?)",
      [note.userId, note.title, note.content, note.tags || "", note.isPinned ? 1 : 0]
    );

    console.log(`Note inserted successfully with ID: ${result.lastInsertRowId}`);

    dbEventEmitter.emit("notesUpdated");

    return result.lastInsertRowId ?? null;
  } catch (error) {
    console.error("Error inserting note:", error);
    return null;
  }
};

// **Update Note**
export const updateNote = async (noteId: number, note: Note): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, tags = ?, is_pinned = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [note.title, note.content, note.tags || "", note.isPinned ? 1 : 0, noteId]
    );

    console.log(`Note updated successfully with ID: ${noteId}`);

    dbEventEmitter.emit("notesUpdated");

    return result.changes > 0;
  } catch (error) {
    console.error("Error updating note:", error);
    return false;
  }
};

// **Get Note by ID**
export const getNoteByID = async (noteId: number): Promise<Note | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    interface NoteResult {
      id: number;
      user_id: number;
      title: string;
      content: string;
      tags: string;
      is_pinned: number;
      created_at: string;
      updated_at: string;
    }

    const results: NoteResult[] = db.getAllSync("SELECT * FROM notes WHERE id = ?", [noteId]);
    const result: NoteResult | null = results.length > 0 ? results[0] : null;

    if (!result) return null;

    // Function to format date natively
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    return {
      id: result.id,
      userId: result.user_id,
      title: result.title,
      content: result.content,
      tags: result.tags,
      isPinned: result.is_pinned === 1,
      created_at: formatDate(result.created_at),
      updated_at: formatDate(result.updated_at),
    };
  } catch (error) {
    console.error("Error fetching note:", error);
    return null;
  }
};

// **Get All Notes**
export const getAllNotes = async (): Promise<Note[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results: any[] = await db.getAllAsync("SELECT * FROM notes ORDER BY created_at DESC");

    if (!results.length) return null;

    // Function to format date natively
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    return results.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      tags: row.tags,
      isPinned: row.is_pinned === 1,
      created_at: formatDate(row.created_at),
      updated_at: formatDate(row.updated_at),
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return null;
  }
};


// **Delete Note**
export const deleteNote = async (noteId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync("DELETE FROM notes WHERE id = ?", [noteId]);

    if (result.changes > 0) {
      console.log(`Note deleted successfully with ID: ${noteId}`);
      dbEventEmitter.emit("notesUpdated");
      return true;
    } else {
      console.log(`Note with ID: ${noteId} not found.`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

// **Subscribe to Notes Updates**
export const subscribeToNoteUpdates = (callback: () => void) => {
  dbEventEmitter.on("notesUpdated", callback);

  return () => {
    dbEventEmitter.off("notesUpdated", callback);
  };
};
