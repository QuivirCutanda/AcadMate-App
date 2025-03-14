import * as SQLite from "expo-sqlite";

export const setupDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("AcadMate.db");

    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

     // Create AcadMate AI table
    
    console.log("Database & tables initialized successfully");
    return db;
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

export let db: SQLite.SQLiteDatabase | null = null;
setupDatabase().then((database) => {
  if (database) {
    db = database;
  } else {
    console.error("Failed to initialize database");
  }
});
