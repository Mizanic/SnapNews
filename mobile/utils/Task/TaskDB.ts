import Task from '../Task/Task';
import { 
  sqlite, 
  createTaskTable,
  sqlInsertTask,
  sqlGetAllTasks,
  sqlGetTaskById,
  sqlDeleteTask, 
  sqlGetIncompleteTaskCount,
  sqlGetTasksByAction,
  sqlPurgeCompletedTasks
} from './SQLiteDB';

// In-memory fallback for when SQLite is not available
let memoryTasks: Task[] = [];

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
    await sqlInsertTask(taskToSave);
  } catch (error) {
    console.error('Error inserting task:', error);
    // Fallback to in-memory if SQLite fails
    sqlite.isAvailable = false;
    storeTaskInMemory(taskToSave);
  }
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
    const tasks = await sqlGetAllTasks();
    return tasks;
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
    const task = await sqlGetTaskById(id);
    return task;
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
    await sqlDeleteTask(id);
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
    const count = await sqlGetIncompleteTaskCount();
    return count;
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
    const tasks = await sqlGetTasksByAction(actionName);
    return tasks;
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
    const count = await sqlPurgeCompletedTasks();
    return count;
  } catch (error) {
    console.error('Error purging completed tasks:', error);
    sqlite.isAvailable = false;
    
    // Fallback to in-memory
    const initialCount = memoryTasks.length;
    memoryTasks = memoryTasks.filter(task => !task.completed);
    return initialCount - memoryTasks.length;
  }
}
