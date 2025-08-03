import Task from './Task';
import { openDatabase, sqlite } from './DBConfig';

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
      // Drop existing table if it exists to ensure we have the correct schema
      await database.executeSql(`DROP TABLE IF EXISTS tasks;`);
      
      // Create the table with proper AUTOINCREMENT syntax
      await database.executeSql(`
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT,
          actionName TEXT,
          payload TEXT,
          completed INTEGER,
          retryCount INTEGER,
          createdAt TEXT,
          updatedAt TEXT
        );
      `);
      console.log('Tasks table recreated successfully');
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
    id: typeof row.id === 'number' ? row.id : Number(row.id),
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
 * @returns Task with assigned ID (if it was a new task)
 */
export async function sqlInsertTask(task: Task): Promise<Task> {
  if (!sqlite.isAvailable) {
    console.log('SQLite not available, returning task as-is');
    return task;
  }
  
  console.log('Attempting to insert/update task with:', 
    JSON.stringify({ 
      hasId: task.id !== undefined,
      id: task.id, 
      actionName: task.actionName 
    })
  );
  
  const database = await openDatabase();
  if (database) {
    if (task.id) {
      // Update existing task
      await database.executeSql(
        `UPDATE tasks SET 
          description = ?, 
          actionName = ?, 
          payload = ?, 
          completed = ?, 
          retryCount = ?, 
          createdAt = ?, 
          updatedAt = ? 
        WHERE id = ?`,
        [
          task.description,
          task.actionName,
          JSON.stringify(task.payload),
          task.completed ? 1 : 0,
          task.retryCount,
          task.createdAt.toISOString(),
          task.updatedAt.toISOString(),
          task.id
        ]
      );
      return task;
    } else {
      // Insert new task, explicitly state we're letting SQLite generate the ID
      const result = await database.executeSql(
        `INSERT INTO tasks (id, description, actionName, payload, completed, retryCount, createdAt, updatedAt) 
         VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.description,
          task.actionName,
          JSON.stringify(task.payload),
          task.completed ? 1 : 0,
          task.retryCount,
          task.createdAt.toISOString(),
          task.updatedAt.toISOString()
        ]
      );
      
      // Get the inserted ID - ensure it's always a number
      let insertId = result[0].insertId;
      if (typeof insertId !== 'number') {
        insertId = Number(insertId);
      }
      
      // Return the task with the new ID as number
      return {
        ...task,
        id: insertId
      };
    }
  }
  return task;
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
export async function sqlGetTaskById(id: number): Promise<Task | null> {
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
export async function sqlDeleteTask(id: number): Promise<void> {
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
