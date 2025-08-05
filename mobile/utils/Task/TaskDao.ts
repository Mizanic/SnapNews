import Task from './Task';
import { openDatabase, sqlite } from './DBConfig';

/**
 * Creates (or recreates) the tasks table in SQLite with the correct schema.
 * Drops the table if it exists to avoid schema drift.
 * Logs all actions for debugging.
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
      console.log('[TaskDao] Dropping existing tasks table (if any)');
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
      console.log('[TaskDao] Tasks table recreated successfully');
    }
  } catch (error) {
    console.error('[TaskDao] Error creating task table:', error);
    sqlite.isAvailable = false;
  }
}

/**
 * Converts a database row into a Task object.
 * Handles type conversion and JSON parsing.
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
 * Inserts a new task or updates an existing one in the database.
 * If task.id is present, updates the task; otherwise, inserts a new task and lets SQLite generate the ID.
 * Logs all actions and errors for debugging.
 * @param task Task to insert or update
 * @returns Task with assigned ID (if it was a new task)
 */
export async function sqlInsertTask(task: Task): Promise<Task> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, returning task as-is');
    return task;
  }
  console.log('[TaskDao] Attempting to insert/update task:', {
    hasId: task.id !== undefined,
    id: task.id,
    actionName: task.actionName,
    completed: task.completed
  });
  const database = await openDatabase();
  if (database) {
    if (task.id) {
      // Update existing task
      console.log('[TaskDao] Updating existing task with id:', task.id);
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
      console.log('[TaskDao] Task updated:', task.id);
      return task;
    } else {
      // Insert new task, explicitly state we're letting SQLite generate the ID
      console.log('[TaskDao] Inserting new task (letting SQLite generate id)');
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
      console.log('[TaskDao] Task inserted with new id:', insertId);
      // Return the task with the new ID as number
      return {
        ...task,
        id: insertId
      };
    }
  }
  console.warn('[TaskDao] Database not available, returning task as-is');
  return task;
}

/**
 * Retrieves all tasks from the database.
 * Logs the number of tasks found.
 * @returns Array of Task objects
 */
export async function sqlGetAllTasks(): Promise<Task[]> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, returning empty task list');
    return [];
  }
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT * FROM tasks');
    const tasks = Array(results[0].rows.length);
    for (let i = 0; i < results[0].rows.length; i++) {
      tasks[i] = parseTaskFromRow(results[0].rows.item(i));
    }
    console.log(`[TaskDao] Retrieved ${tasks.length} tasks from database`);
    return tasks;
  }
  console.warn('[TaskDao] Database not available, returning empty task list');
  return [];
}

/**
 * Retrieves a single task by its ID from the database.
 * Logs the action and result.
 * @param id The ID of the task to retrieve
 * @returns The Task object if found, or null
 */
export async function sqlGetTaskById(id: number): Promise<Task | null> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, cannot get task by id');
    return null;
  }
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT * FROM tasks WHERE id = ?', [id]);
    if (results[0].rows.length > 0) {
      console.log('[TaskDao] Found task with id:', id);
      return parseTaskFromRow(results[0].rows.item(0));
    } else {
      console.log('[TaskDao] No task found with id:', id);
    }
  }
  console.warn('[TaskDao] Database not available or task not found');
  return null;
}

/**
 * Deletes a task by its ID from the database.
 * Logs the action and result.
 * @param id The ID of the task to delete
 */
export async function sqlDeleteTask(id: number): Promise<void> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, cannot delete task');
    return;
  }
  const database = await openDatabase();
  if (database) {
    await database.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
    console.log('[TaskDao] Deleted task with id:', id);
  } else {
    console.warn('[TaskDao] Database not available, could not delete task');
  }
}

/**
 * Gets a count of incomplete tasks from the database.
 * Logs the result.
 * @returns The number of incomplete tasks
 */
export async function sqlGetIncompleteTaskCount(): Promise<number> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, returning 0 incomplete tasks');
    return 0;
  }
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT COUNT(*) as count FROM tasks WHERE completed = 0');
    const count = results[0].rows.item(0).count;
    console.log('[TaskDao] Incomplete task count:', count);
    return count;
  }
  console.warn('[TaskDao] Database not available, returning 0 incomplete tasks');
  return 0;
}

/**
 * Gets all tasks by action name from the database.
 * Logs the number of tasks found.
 * @param actionName The action name to filter by
 * @returns Array of Task objects
 */
export async function sqlGetTasksByAction(actionName: string): Promise<Task[]> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, returning empty task list for action:', actionName);
    return [];
  }
  const database = await openDatabase();
  if (database) {
    const results = await database.executeSql('SELECT * FROM tasks WHERE actionName = ?', [actionName]);
    const tasks = Array(results[0].rows.length);
    for (let i = 0; i < results[0].rows.length; i++) {
      tasks[i] = parseTaskFromRow(results[0].rows.item(i));
    }
    console.log(`[TaskDao] Retrieved ${tasks.length} tasks for action '${actionName}' from database`);
    return tasks;
  }
  console.warn('[TaskDao] Database not available, returning empty task list for action:', actionName);
  return [];
}

/**
 * Deletes all completed tasks from the database.
 * Logs the number of tasks deleted.
 * @returns The number of tasks deleted
 */
export async function sqlPurgeCompletedTasks(): Promise<number> {
  if (!sqlite.isAvailable) {
    console.log('[TaskDao] SQLite not available, returning 0 purged tasks');
    return 0;
  }
  const database = await openDatabase();
  if (database) {
    // Get count first
    const countResults = await database.executeSql('SELECT COUNT(*) as count FROM tasks WHERE completed = 1');
    const count = countResults[0].rows.item(0).count;
    // Delete completed tasks
    await database.executeSql('DELETE FROM tasks WHERE completed = 1');
    console.log('[TaskDao] Purged completed tasks, count:', count);
    return count;
  }
  console.warn('[TaskDao] Database not available, returning 0 purged tasks');
  return 0;
}
