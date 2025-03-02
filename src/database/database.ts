import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("mydatabase.db");

export default db;