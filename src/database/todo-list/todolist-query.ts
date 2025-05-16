import { db } from "../database";
import { EventEmitter } from "events";

export const dbEventEmitter = new EventEmitter();

// Task interface matching your database schema
export interface Task {
  id?: number;
  user_id: number;
  project_id?: number | null;
  title: string;
  description?: string;
  due_date?: string | null;
  priority: number; // 0=None, 1=Low, 2=Medium, 3=High
  is_completed: boolean;
  is_important: boolean;
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
  tags?: number[]; // Add this line
}

export interface Subtask {
  id?: number;
  task_id: number;
  title: string;
  is_completed: boolean;
  created_at?: string;
}

export interface Project {
  id?: number;
  user_id: number;
  name: string;
  color: string;
  created_at?: string;
}

export interface Tag {
  id?: number;
  user_id: number;
  name: string;
  color: string;
  created_at?: string;
}

// **Insert Task**
export const insertTask = async (task: Omit<Task, 'id'>): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      `INSERT INTO tasks (
        user_id, project_id, title, description, 
        due_date, priority, is_completed, is_important
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.user_id,
        task.project_id || null,
        task.title,
        task.description || null,
        task.due_date || null,
        task.priority,
        task.is_completed ? 1 : 0,
        task.is_important ? 1 : 0
      ]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error("Error inserting task:", error);
    return null;
  }
};

// **Update Task**
export const updateTask = async (taskId: number, task: Partial<Task>): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      `UPDATE tasks SET 
        project_id = ?, title = ?, description = ?, 
        due_date = ?, priority = ?, is_completed = ?, 
        is_important = ?, completed_at = ?
       WHERE id = ?`,
      [
        task.project_id !== undefined ? task.project_id : null,
        task.title !== undefined ? task.title : null,
        task.description !== undefined ? task.description : null,
        task.due_date !== undefined ? task.due_date : null,
        task.priority !== undefined ? task.priority : null,
        task.is_completed !== undefined ? (task.is_completed ? 1 : 0) : null,
        task.is_important !== undefined ? (task.is_important ? 1 : 0) : null,
        task.is_completed !== undefined
          ? (task.is_completed ? new Date().toISOString() : null)
          : null,
        taskId
      ]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.changes > 0;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
};

// **Get Task by ID**
export const getTaskById = async (taskId: number): Promise<Task | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.getFirstAsync<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    );

    return result ? {
      ...result,
      is_completed: typeof result.is_completed === "number" ? result.is_completed === 1 : !!result.is_completed,
      is_important: typeof result.is_important === "number" ? result.is_important === 1 : !!result.is_important
    } : null;
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

// **Get All Tasks**
export const getAllTasks = async (userId: number, filters: {
  projectId?: number;
  isCompleted?: boolean;
} = {}): Promise<Task[]> => {
  try {
    if (!db) throw new Error("Database connection is null");

    let query = "SELECT * FROM tasks WHERE user_id = ?";
    const params: any[] = [userId];

    if (filters.projectId !== undefined) {
      query += " AND project_id = ?";
      params.push(filters.projectId);
    }

    if (filters.isCompleted !== undefined) {
      query += " AND is_completed = ?";
      params.push(filters.isCompleted ? 1 : 0);
    }

    query += " ORDER BY is_completed ASC, due_date ASC";

    const results = await db.getAllAsync<Task>(query, params);

    return results.map(task => ({
      ...task,
      is_completed: typeof task.is_completed === "number" ? task.is_completed === 1 : !!task.is_completed,
      is_important: typeof task.is_important === "number" ? task.is_important === 1 : !!task.is_important
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// **Delete Task**
export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "DELETE FROM tasks WHERE id = ?",
      [taskId]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

// **Get Subtasks for Task**
export const getSubtasks = async (taskId: number): Promise<Subtask[]> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results = await db.getAllAsync<Subtask>(
      "SELECT * FROM subtasks WHERE task_id = ? ORDER BY created_at ASC",
      [taskId]
    );

    return results.map(subtask => ({
      ...subtask,
      is_completed: typeof subtask.is_completed === "number" ? subtask.is_completed === 1 : !!subtask.is_completed
    }));
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return [];
  }
};

// **Add Subtask**
export const addSubtask = async (subtask: Omit<Subtask, 'id'>): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT INTO subtasks (task_id, title, is_completed) VALUES (?, ?, ?)",
      [subtask.task_id, subtask.title, subtask.is_completed ? 1 : 0]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error("Error adding subtask:", error);
    return null;
  }
};

// **Update Subtask**
export const updateSubtask = async (subtaskId: number, subtask: Partial<Subtask>): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "UPDATE subtasks SET title = ?, is_completed = ? WHERE id = ?",
      [subtask.title ?? "", subtask.is_completed ? 1 : 0, subtaskId]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.changes > 0;
  } catch (error) {
    console.error("Error updating subtask:", error);
    return false;
  }
};

// **Delete Subtask**
export const deleteSubtask = async (subtaskId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "DELETE FROM subtasks WHERE id = ?",
      [subtaskId]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting subtask:", error);
    return false;
  }
};

// **Get All Projects**
export const getAllProjects = async (userId: number): Promise<Project[]> => {
  try {
    if (!db) throw new Error("Database connection is null");

    return await db.getAllAsync<Project>(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY name ASC",
      [userId]
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// **Get All Tags**
export const getAllTags = async (userId: number): Promise<Tag[]> => {
  try {
    if (!db) throw new Error("Database connection is null");

    return await db.getAllAsync<Tag>(
      "SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC",
      [userId]
    );
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

// **Get Tags for Task**
export const getTagsForTask = async (taskId: number): Promise<Tag[]> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results = await db.getAllAsync<Tag>(
      `SELECT tags.* FROM tags
       JOIN task_tags ON tags.id = task_tags.tag_id
       WHERE task_tags.task_id = ?`,
      [taskId]
    );

    return results;
  } catch (error) {
    console.error("Error fetching tags for task:", error);
    return [];
  }
};

// **Add Tag to Task**
export const addTagToTask = async (taskId: number, tagId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)",
      [taskId, tagId]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.changes > 0;
  } catch (error) {
    console.error("Error adding tag to task:", error);
    return false;
  }
};

// **Remove Tag from Task**
export const removeTagFromTask = async (taskId: number, tagId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?",
      [taskId, tagId]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.changes > 0;
  } catch (error) {
    console.error("Error removing tag from task:", error);
    return false;
  }
};

// **Create New Tag**
export const createTag = async (tag: Omit<Tag, 'id'>): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      "INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)",
      [tag.user_id, tag.name, tag.color]
    );

    dbEventEmitter.emit("tasksUpdated");
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
};

// **Update Task with Tags**
export const updateTaskTags = async (taskId: number, tagIds: number[]): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    // Begin transaction
    await db.execAsync("BEGIN TRANSACTION");

    try {
      // Remove all existing tags for this task
      await db.runAsync("DELETE FROM task_tags WHERE task_id = ?", [taskId]);

      // Add new tags
      for (const tagId of tagIds) {
        await db.runAsync(
          "INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)",
          [taskId, tagId]
        );
      }

      // Commit transaction
      await db.execAsync("COMMIT");
      dbEventEmitter.emit("tasksUpdated");
      return true;
    } catch (error) {
      // Rollback on error
      await db.execAsync("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error updating task tags:", error);
    return false;
  }
};
// **Subscribe to Tasks Updates**
export const subscribeToTasksUpdates = (callback: () => void) => {
  dbEventEmitter.on("tasksUpdated", callback);
  return () => {
    dbEventEmitter.off("tasksUpdated", callback);
  };
};