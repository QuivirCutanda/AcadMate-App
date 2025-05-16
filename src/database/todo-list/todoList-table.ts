import * as SQLite from "expo-sqlite";
import { db } from "../database";

export async function TodoListTables() {
  try {
    if (!db) throw new Error("Database connection is null");

    const statements = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,

      // Projects table
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        color TEXT DEFAULT '#3498db',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Tasks table
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_id INTEGER,
        title TEXT NOT NULL,
        description TEXT DEFAULT NULL,
        due_date DATETIME DEFAULT NULL,
        priority INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        is_important INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      );`,

      // Subtasks table
      `CREATE TABLE IF NOT EXISTS subtasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );`,

      // Tags table
      `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        color TEXT DEFAULT '#95a5a6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Task-Tag mapping table
      `CREATE TABLE IF NOT EXISTS task_tags (
        task_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (task_id, tag_id),
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );`,

      // Recurring patterns
      `CREATE TABLE IF NOT EXISTS recurring_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        interval INTEGER DEFAULT 1,
        days_of_week TEXT DEFAULT NULL,
        day_of_month INTEGER DEFAULT NULL,
        month_of_year INTEGER DEFAULT NULL,
        end_date DATETIME DEFAULT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );`,

      // Indexes
      `CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks(is_completed);`,
      `CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);`,
      `CREATE INDEX IF NOT EXISTS idx_task_tags_task_id ON task_tags(task_id);`,
      `CREATE INDEX IF NOT EXISTS idx_task_tags_tag_id ON task_tags(tag_id);`,

      // Trigger: update task.updated_at
      `CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
        AFTER UPDATE ON tasks
        FOR EACH ROW
        BEGIN
          UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;`,

      // Trigger: complete task when all subtasks are completed
      `CREATE TRIGGER IF NOT EXISTS update_parent_task_completion
        AFTER UPDATE ON subtasks
        FOR EACH ROW
        WHEN NEW.is_completed != OLD.is_completed
        BEGIN
          UPDATE tasks
          SET is_completed = 1, completed_at = CURRENT_TIMESTAMP
          WHERE id = NEW.task_id AND NOT EXISTS (
            SELECT 1 FROM subtasks WHERE task_id = NEW.task_id AND is_completed = 0
          );
        END;`,
    ];

    // Execute statements one-by-one
    for (const sql of statements) {
      await db.execAsync(sql);
    }

    console.log("TodoList tables initialized successfully");
    return db;
  } catch (error) {
    console.error("Error setting up TodoList database:", error);
    return null;
  }
}
