import { db } from "./database";

// Function to fetch all users
export const getUsers = async () => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.getAllAsync("SELECT * FROM users");
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Function to insert a message
export const insertMessage = async (userId: number, conversation: any) => {
  try {
    if (!db) throw new Error("Database connection is null");

    const conversationString = JSON.stringify(conversation);
    await db.runAsync("INSERT INTO messages (user_id, conversation) VALUES (?, ?)", [userId, conversationString]);
    console.log("Message inserted successfully");
  } catch (error) {
    console.error("Error inserting message:", error);
  }
};

// Function to get messages by user ID
export const getMessagesByUser = async (userId: number) => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.getAllAsync("SELECT * FROM messages WHERE user_id = ?", [userId]) as MessageRow[];

    interface MessageRow {
      id: number;
      user_id: number;
      timestamp: string;
      conversation: string;
    }

    return result.map((row: MessageRow) => {
      if (typeof row === "object" && row !== null) {
        return {
          id: row.id,
          user_id: row.user_id,
          timestamp: row.timestamp,
          conversation: JSON.parse(row.conversation),
        };
      } else {
        throw new Error("Row is not an object");
      }
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

