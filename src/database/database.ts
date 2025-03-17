import * as SQLite from "expo-sqlite";

export const setupDatabase = async () => {
  try {
    // Open database using expo-sqlite 12+
    const db = await SQLite.openDatabaseAsync("AcadMate.db");

    // Create users and messages tables
    await db.execAsync(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE,
    profile_pic TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        conversation TEXT NOT NULL,  -- Store JSON as TEXT
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Database & tables initialized successfully");
    return db;
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

// Export database instance
export let db: SQLite.SQLiteDatabase | null = null;
setupDatabase().then((database) => {
  if (database) {
    db = database;
  } else {
    console.error("Failed to initialize database");
  }
});
