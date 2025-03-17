import { db } from "./database";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  profilePic: string;
}

export const insertUser = async (user: User): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT INTO users (firstname, lastname, email, profile_pic) VALUES (?, ?, ?, ?)",
      [user.firstname, user.lastname, user.email, user.profilePic]
    );

    console.log(`User inserted successfully with ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId ?? null;
  } catch (error) {
    console.error("Error inserting user:", error);
    return null;
  }
};



// Example usage
// (async () => {
//   try {
//     const userId = await insertUser({
//       firstname: "John",
//       lastname: "Doe",
//       email: "john.doe@example.com",
//       profilePic: "path/to/profile_pic.jpg",
//     });
//     console.log(`Inserted user ID: ${userId}`);
//   } catch (error) {
//     console.error("Insertion failed:", error);
//   }
// })();

export const updateUser = async (userId: number, user: User): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, profile_pic = ? WHERE id = ?",
      [user.firstname, user.lastname, user.email, user.profilePic, userId]
    );

    console.log(`User updated successfully with ID: ${userId}`);
    return result.changes > 0;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};



export const getAllUsers = async (): Promise<User[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results = await db.getAllAsync("SELECT * FROM users");

    return results.map((row: any) => ({
      id: row.id, 
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      profilePic: row.profile_pic,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

  
//   // Example usage
//   (async () => {
//     try {
//       const users = await getAllUsers();
//       console.log("All Users:", users);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   })();
  