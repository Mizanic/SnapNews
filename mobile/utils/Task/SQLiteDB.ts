import type { SQLiteDatabase } from 'react-native-sqlite-storage';
import Task from './Task';

// Database configuration
const DB_CONFIG = {
  name: 'tasks.db',
  location: 'default',
};

// SQLite state
export type SQLiteState = {
  isAvailable: boolean;
  instance: any;
  connection: SQLiteDatabase | null;
}

export const sqlite: SQLiteState = {
  isAvailable: false,
  instance: null,
  connection: null
};

// Initialize SQLite if available
try {
  sqlite.instance = require('react-native-sqlite-storage');
  sqlite.instance.enablePromise(true);
  sqlite.isAvailable = true;
  console.log('SQLite module loaded successfully');
} catch (error) {
  console.warn('SQLite not available, using in-memory fallback', error);
}

/**
 * Opens a connection to the SQLite database or returns the existing connection
 * @returns SQLite database connection or null if not available
 */
export async function openDatabase(): Promise<SQLiteDatabase | null> {
  if (!sqlite.isAvailable) {
    console.log('Using in-memory database fallback');
    return null;
  }
  
  if (!sqlite.connection) {
    try {
      sqlite.connection = await sqlite.instance.openDatabase(DB_CONFIG);
      console.log('SQLite database opened successfully');
    } catch (error) {
      console.error('Error opening database:', error);
      sqlite.isAvailable = false;
      return null;
    }
  }
  return sqlite.connection;
}

/**
 * Creates the tasks table if it doesn't exist
 * @returns Promise that resolves when the table is created or when using in-memory storage
 */
export async function createTaskTable(): Promise<void> {
  if (!sqlite.isAvailable) {
    console.log('SQLite not available, using in-memory storage');
    return;
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY NOT NULL,
          description TEXT,
          actionName TEXT,
          payload TEXT,
          completed INTEGER,
          retryCount INTEGER,
          createdAt TEXT,
          updatedAt TEXT
        );
      `);
      console.log('Tasks table created or already exists');
    }
  } catch (error) {
    console.error('Error creating task table:', error);
    sqlite.isAvailable = false;
  }
}

/**
 * Creates a Task object from a database row
 * @param row Database row containing task data
 * @returns Task object
 */
export function parseTaskFromRow(row: any): Task {
  return {
    id: row.id,
    description: row.description,
    actionName: row.actionName,
    payload: JSON.parse(row.payload),
    completed: !!row.completed,
    retryCount: row.retryCount,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  };
}

/**
 * Insert a task into the database
 * @param task Task to insert
 */
export async function sqlInsertTask(task: Task): Promise<void> {
  if (!sqlite.isAvailable) {
    return;
  }
  
  const database = await openDatabase();
  if (database) {
    await database.executeSql(
      `INSERT OR REPLACE INTO tasks (id, description, actionName, payload, completed, retryCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.description,
        task.actionName,
        JSON.stringify(task.payload),
        task.completed ? 1 : 0,
        task.retryCount,
        task.createdAt.toISOString(),
        task.updatedAt.toISOString()
      ]
    );
  }
}

/**
 * Get all tasks from the database
 */
export async function sqlGetAllTasks(): Promise<Task[]> {
  if (!sqlite.isAvailable) {
    return [];
  }
  
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT * FROM tasks');
    
    const tasks = Array(results[0].rows.length);
    for (let i = 0; i < results[0].rows.length; i++) {
      tasks[i] = parseTaskFromRow(results[0].rows.item(i));
    }
    return tasks;
  }
  return [];
}

/**
 * Get a task by its ID from the database
 */
export async function sqlGetTaskById(id: string): Promise<Task | null> {
  if (!sqlite.isAvailable) {
    return null;
  }
  
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT * FROM tasks WHERE id = ?', [id]);
    if (results[0].rows.length > 0) {
      return parseTaskFromRow(results[0].rows.item(0));
    }
  }
  return null;
}

/**
 * Delete a task by its ID from the database
 */
export async function sqlDeleteTask(id: string): Promise<void> {
  if (!sqlite.isAvailable) {
    return;
  }
  
  const database = await openDatabase();
  if (database) {
    await database.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
  }
}

/**
 * Get a count of incomplete tasks from the database
 */
export async function sqlGetIncompleteTaskCount(): Promise<number> {
  if (!sqlite.isAvailable) {
    return 0;
  }
  
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT COUNT(*) as count FROM tasks WHERE completed = 0');
    return results[0].rows.item(0).count;
  }
  return 0;
}

/**
 * Get tasks by action name from the database
 */
export async function sqlGetTasksByAction(actionName: string): Promise<Task[]> {
  if (!sqlite.isAvailable) {
    return [];
  }
  
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT * FROM tasks WHERE actionName = ?', [actionName]);
    const tasks = Array(results[0].rows.length);
    for (let i = 0; i < results[0].rows.length; i++) {
      tasks[i] = parseTaskFromRow(results[0].rows.item(i));
    }
    return tasks;
  }
  return [];
}

/**
 * Delete all completed tasks from the database
 */
export async function sqlPurgeCompletedTasks(): Promise<number> {
  if (!sqlite.isAvailable) {
    return 0;
  }
  
  const database = await openDatabase();
  if (database) {
    // Get count first
    const countResults = await database.executeSql('SELECT COUNT(*) as count FROM tasks WHERE completed = 1');
    const count = countResults[0].rows.item(0).count;
    
    // Delete completed tasks
    await database.executeSql('DELETE FROM tasks WHERE completed = 1');
    return count;
  }
  return 0;
}
