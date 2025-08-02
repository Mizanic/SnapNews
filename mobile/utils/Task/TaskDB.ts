import Task from '../Task/Task';
import type { SQLiteDatabase } from 'react-native-sqlite-storage';

// Database configuration
const DB_CONFIG = {
  name: 'TaskDB.db',
  location: 'default',
};

// In-memory fallback for when SQLite is not available
let memoryTasks: Task[] = [];

// SQLite state
type SQLiteState = {
  isAvailable: boolean;
  instance: any;
  connection: SQLiteDatabase | null;
}

const sqlite: SQLiteState = {
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
 * Stores a task in memory
 * @param task The task to store
 */
function storeTaskInMemory(task: Task): void {
  const existingIndex = memoryTasks.findIndex(t => t.id === task.id);
  if (existingIndex >= 0) {
    memoryTasks[existingIndex] = task;
  } else {
    memoryTasks.push(task);
  }
  console.log('Task stored in memory:', task.id);
}

/**
 * Inserts or updates a task in the database
 * @param task The task to insert or update
 */
export async function insertTask(task: Task): Promise<void> {
  // Clone the task to avoid modifying the original object
  const taskToSave = { ...task };
  
  if (!sqlite.isAvailable) {
    storeTaskInMemory(taskToSave);
    return;
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      await database.executeSql(
        `INSERT OR REPLACE INTO tasks (id, description, actionName, payload, completed, retryCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          taskToSave.id,
          taskToSave.description,
          taskToSave.actionName,
          JSON.stringify(taskToSave.payload),
          taskToSave.completed ? 1 : 0,
          taskToSave.retryCount,
          taskToSave.createdAt.toISOString(),
          taskToSave.updatedAt.toISOString()
        ]
      );
    }
  } catch (error) {
    console.error('Error inserting task:', error);
    // Fallback to in-memory if SQLite fails
    sqlite.isAvailable = false;
    storeTaskInMemory(taskToSave);
  }
}

/**
 * Creates a Task object from a database row
 * @param row Database row containing task data
 * @returns Task object
 */
function parseTaskFromRow(row: any): Task {
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
 * Gets all tasks from the database
 * @returns Array of tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  if (!sqlite.isAvailable) {
    return [...memoryTasks]; // Return a copy to prevent direct modification
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      const results = await database.executeSql('SELECT * FROM tasks');
      
      // Optimize this with a direct mapping instead of forEach
      const tasks = Array(results[0].rows.length);
      for (let i = 0; i < results[0].rows.length; i++) {
        tasks[i] = parseTaskFromRow(results[0].rows.item(i));
      }
      return tasks;
    }
    return [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    sqlite.isAvailable = false;
    return [...memoryTasks]; // Return a copy to prevent direct modification
  }
}

/**
 * Gets a task by its ID
 * @param id The ID of the task to retrieve
 * @returns The task if found, null otherwise
 */
export async function getTaskById(id: string): Promise<Task | null> {
  if (!sqlite.isAvailable) {
    return memoryTasks.find(task => task.id === id) || null;
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      const results = await database.executeSql('SELECT * FROM tasks WHERE id = ?', [id]);
      if (results[0].rows.length > 0) {
        return parseTaskFromRow(results[0].rows.item(0));
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    sqlite.isAvailable = false;
    // Fallback to in-memory
    return memoryTasks.find(task => task.id === id) || null;
  }
}

/**
 * Deletes a task by its ID
 * @param id The ID of the task to delete
 */
export async function deleteTask(id: string): Promise<void> {
  if (!sqlite.isAvailable) {
    // Remove from memory
    const index = memoryTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      memoryTasks.splice(index, 1);
    }
    return;
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      await database.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    sqlite.isAvailable = false;
    // Fallback to in-memory
    const index = memoryTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      memoryTasks.splice(index, 1);
    }
  }
}

/**
 * Gets a count of incomplete tasks
 * @returns The number of incomplete tasks
 */
export async function getIncompleteTaskCount(): Promise<number> {
  if (!sqlite.isAvailable) {
    return memoryTasks.filter(task => !task.completed).length;
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      const results = await database.executeSql('SELECT COUNT(*) as count FROM tasks WHERE completed = 0');
      return results[0].rows.item(0).count;
    }
    return 0;
  } catch (error) {
    console.error('Error getting incomplete task count:', error);
    sqlite.isAvailable = false;
    return memoryTasks.filter(task => !task.completed).length;
  }
}

/**
 * Gets tasks by action name
 * @param actionName The action name to filter by
 * @returns Array of tasks with the specified action name
 */
export async function getTasksByAction(actionName: string): Promise<Task[]> {
  if (!sqlite.isAvailable) {
    return memoryTasks.filter(task => task.actionName === actionName);
  }
  
  try {
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
  } catch (error) {
    console.error(`Error getting tasks by action ${actionName}:`, error);
    sqlite.isAvailable = false;
    return memoryTasks.filter(task => task.actionName === actionName);
  }
}

/**
 * Updates a task's completion status
 * @param id Task ID
 * @param completed New completion status
 */
export async function updateTaskStatus(id: string, completed: boolean): Promise<void> {
  // First get the task
  const task = await getTaskById(id);
  if (!task) {
    console.warn(`Task with ID ${id} not found for status update`);
    return;
  }
  
  // Update the task and save it
  task.completed = completed;
  task.updatedAt = new Date();
  await insertTask(task);
}

/**
 * Purges all completed tasks
 * @returns Number of tasks purged
 */
export async function purgeCompletedTasks(): Promise<number> {
  if (!sqlite.isAvailable) {
    const initialCount = memoryTasks.length;
    memoryTasks = memoryTasks.filter(task => !task.completed);
    return initialCount - memoryTasks.length;
  }
  
  try {
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
  } catch (error) {
    console.error('Error purging completed tasks:', error);
    sqlite.isAvailable = false;
    
    // Fallback to in-memory
    const initialCount = memoryTasks.length;
    memoryTasks = memoryTasks.filter(task => !task.completed);
    return initialCount - memoryTasks.length;
  }
}
