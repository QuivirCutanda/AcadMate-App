    -- Existing Users table
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT UNIQUE,
        profile_pic TEXT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Existing Messages table
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        conversation TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Existing Decks table
    CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        is_important INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Existing Flashcards table
    CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        image TEXT,
        audio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );

    -- Existing Study Sessions table
    CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        flashcard_id INTEGER NOT NULL,
        last_reviewed DATETIME DEFAULT CURRENT_TIMESTAMP,
        next_review DATETIME,
        review_count INTEGER DEFAULT 0,
        correct_attempts INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
    );

    -- Existing Flashcard Options table
    CREATE TABLE IF NOT EXISTS flashcard_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flashcard_id INTEGER NOT NULL,
        option_text TEXT NOT NULL,
        is_correct INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
    );

    -- Existing Notes table
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

    -- New Todo List table
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATETIME,
        priority INTEGER DEFAULT 2, -- 1=High, 2=Medium, 3=Low
        is_completed INTEGER DEFAULT 0, -- 0=Not completed, 1=Completed
        category TEXT, -- e.g., "School", "Personal", "Work"
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- New Expense Tracker table
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL, -- e.g., "Food", "Transport", "Entertainment"
        transaction_type INTEGER NOT NULL, -- 1=Income, 2=Expense
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        payment_method TEXT, -- e.g., "Cash", "Credit Card", "Bank Transfer"
        is_recurring INTEGER DEFAULT 0, -- 0=No, 1=Yes
        recurrence_interval TEXT, -- e.g., "Monthly", "Weekly"
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- New Allowance/Budget table
    CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        budget_amount REAL NOT NULL,
        current_amount REAL NOT NULL,
        period TEXT NOT NULL, -- "Weekly", "Monthly", "Semester"
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
    CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
    CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
    CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

    -- Trigger to update notes
    CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
    AFTER UPDATE ON notes
    FOR EACH ROW
    BEGIN
        UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;

    -- Trigger to update completed_at when todo is marked complete
    CREATE TRIGGER IF NOT EXISTS update_todo_completed_at
    AFTER UPDATE OF is_completed ON todos
    FOR EACH ROW
    WHEN NEW.is_completed = 1 AND OLD.is_completed = 0
    BEGIN
        UPDATE todos SET completed_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;