import Task from '../Task/Task';

// In-memory fallback for when SQLite is not available
let memoryTasks: Task[] = [];

let isSQLiteAvailable = true;
let SQLite: any;
let db: any;

try {
  SQLite = require('react-native-sqlite-storage');
  SQLite.enablePromise(true);
  
  const database_name = 'TaskDB.db';
  const database_version = '1.0';
  const database_displayname = 'Task Database';
  const database_size = 200000;
} catch (error) {
  console.warn('SQLite not available, using in-memory fallback', error);
  isSQLiteAvailable = false;
}

export async function openDatabase() {
  if (!isSQLiteAvailable) {
    console.log('Using in-memory database fallback');
    return null;
  }
  
  if (!db) {
    try {
      db = await SQLite.openDatabase({
        name: 'TaskDB.db',
        location: 'default',
      });
    } catch (error) {
      console.error('Error opening database:', error);
      isSQLiteAvailable = false;
    }
  }
  return db;
}

export async function createTaskTable() {
  if (!isSQLiteAvailable) {
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
    }
  } catch (error) {
    console.error('Error creating task table:', error);
    isSQLiteAvailable = false;
  }
}

export async function insertTask(task: Task) {
  if (!isSQLiteAvailable) {
    // Store in memory instead
    const existingIndex = memoryTasks.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      memoryTasks[existingIndex] = task;
    } else {
      memoryTasks.push(task);
    }
    console.log('Task stored in memory:', task.id);
    return;
  }
  
  try {
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
  } catch (error) {
    console.error('Error inserting task:', error);
    // Fallback to in-memory if SQLite fails
    isSQLiteAvailable = false;
    await insertTask(task); // Try again with in-memory storage
  }
}

export async function getAllTasks(): Promise<Task[]> {
  if (!isSQLiteAvailable) {
    return [...memoryTasks];
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      const results = await database.executeSql('SELECT * FROM tasks');
      const tasks: Task[] = [];
      results[0].rows.raw().forEach((row: any) => {
        tasks.push({
          id: row.id,
          description: row.description,
          actionName: row.actionName,
          payload: JSON.parse(row.payload),
          completed: !!row.completed,
          retryCount: row.retryCount,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt)
        });
      });
      return tasks;
    }
    return [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    isSQLiteAvailable = false;
    return [...memoryTasks];
  }
}

export async function getTaskById(id: string): Promise<Task | null> {
  if (!isSQLiteAvailable) {
    return memoryTasks.find(task => task.id === id) || null;
  }
  
  try {
    const database = await openDatabase();
    if (database) {
      const results = await database.executeSql('SELECT * FROM tasks WHERE id = ?', [id]);
      if (results[0].rows.length > 0) {
        const row = results[0].rows.item(0);
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
    }
    return null;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    isSQLiteAvailable = false;
    return getTaskById(id);
  }
}

export async function deleteTask(id: string) {
  if (!isSQLiteAvailable) {
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
    isSQLiteAvailable = false;
    await deleteTask(id); // Try again with in-memory storage
  }
}
