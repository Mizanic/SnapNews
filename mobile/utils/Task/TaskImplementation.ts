import TaskInterface from "./TaskInterface";
import Task from "./Task";
import { sqlite } from "./DBConfig";
import { 
  createTaskTable,
  sqlInsertTask,
  sqlGetAllTasks,
  sqlGetTaskById,
  sqlDeleteTask, 
  sqlGetIncompleteTaskCount,
  sqlGetTasksByAction,
  sqlPurgeCompletedTasks
} from "./TaskDao";

/**
 * Implementation of TaskInterface for managing tasks
 * with SQLite storage and in-memory fallback
 */
class TaskImplementation implements TaskInterface {
  // In-memory fallback for when SQLite is not available
  private memoryTasks: Task[] = [];

  constructor() {
    // Initialize the database table
    this.initializeDatabase();
  }

  /**
   * Initialize the database table
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await createTaskTable();
    } catch (error) {
      console.error('Error initializing task database:', error);
    }
  }

  /**
   * Store a task in memory (fallback when SQLite is unavailable)
   * @param task The task to store in memory
   */
  private storeTaskInMemory(task: Task): void {
    if (!task.id) {
      // Generate a simple timestamp-based ID for new tasks
      task.id = Date.now().toString();
    }
    
    const existingIndex = this.memoryTasks.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      this.memoryTasks[existingIndex] = task;
    } else {
      this.memoryTasks.push(task);
    }
    console.log('Task stored in memory:', task.id);
  }

  /**
   * Adds a new task to the database
   * @param task The task to push to the database
   * @returns The task with its assigned ID
   */
  async pushTask(task: Task): Promise<Task> {
    // Clone the task to avoid modifying the original object
    const taskToSave = { ...task };
    
    if (!sqlite.isAvailable) {
      // For in-memory tasks, generate a simple ID if one doesn't exist
      if (!taskToSave.id) {
        taskToSave.id = Date.now().toString();
      }
      this.storeTaskInMemory(taskToSave);
      return taskToSave;
    }
    
    try {
      // sqlInsertTask now returns the task with its ID
      const savedTask = await sqlInsertTask(taskToSave);
      return savedTask;
    } catch (error) {
      console.error('Error inserting task:', error);
      // Fallback to in-memory if SQLite fails
      sqlite.isAvailable = false;
      
      // For in-memory tasks, generate a simple ID if one doesn't exist
      if (!taskToSave.id) {
        taskToSave.id = Date.now().toString();
      }
      this.storeTaskInMemory(taskToSave);
      return taskToSave;
    }
  }

  /**
   * Gets all tasks from the database
   * @returns Array of all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    if (!sqlite.isAvailable) {
      return [...this.memoryTasks]; // Return a copy to prevent direct modification
    }
    
    try {
      const tasks = await sqlGetAllTasks();
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      sqlite.isAvailable = false;
      return [...this.memoryTasks]; // Return a copy to prevent direct modification
    }
  }

  /**
   * Gets a task by its ID
   * @param id The ID of the task to retrieve
   * @returns The task if found, null otherwise
   */
  async getTaskById(id: string): Promise<Task | null> {
    if (!sqlite.isAvailable) {
      return this.memoryTasks.find(task => task.id === id) || null;
    }
    
    try {
      const task = await sqlGetTaskById(id);
      return task;
    } catch (error) {
      console.error('Error getting task by ID:', error);
      sqlite.isAvailable = false;
      // Fallback to in-memory
      return this.memoryTasks.find(task => task.id === id) || null;
    }
  }

  /**
   * Deletes a task by its ID
   * @param id The ID of the task to delete
   */
  async deleteTaskById(id: string): Promise<void> {
    if (!sqlite.isAvailable) {
      // Remove from memory
      const index = this.memoryTasks.findIndex(task => task.id === id);
      if (index !== -1) {
        this.memoryTasks.splice(index, 1);
      }
      return;
    }
    
    try {
      await sqlDeleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      sqlite.isAvailable = false;
      // Fallback to in-memory
      const index = this.memoryTasks.findIndex(task => task.id === id);
      if (index !== -1) {
        this.memoryTasks.splice(index, 1);
      }
    }
  }

  /**
   * Gets a count of incomplete tasks
   * @returns The number of incomplete tasks
   */
  async getIncompleteTaskCount(): Promise<number> {
    if (!sqlite.isAvailable) {
      return this.memoryTasks.filter(task => !task.completed).length;
    }
    
    try {
      const count = await sqlGetIncompleteTaskCount();
      return count;
    } catch (error) {
      console.error('Error getting incomplete task count:', error);
      sqlite.isAvailable = false;
      return this.memoryTasks.filter(task => !task.completed).length;
    }
  }

  /**
   * Gets all incomplete tasks
   * @returns Array of incomplete tasks
   */
  async getIncompleteTask(): Promise<Task[]> {
    if (!sqlite.isAvailable) {
      return this.memoryTasks.filter(task => !task.completed);
    }
    
    try {
      const allTasks = await sqlGetAllTasks();
      return allTasks.filter(task => !task.completed);
    } catch (error) {
      console.error('Error getting incomplete tasks:', error);
      sqlite.isAvailable = false;
      return this.memoryTasks.filter(task => !task.completed);
    }
  }

  /**
   * Gets tasks by action name
   * @param actionName The action name to filter by
   * @returns Array of tasks with the specified action name
   */
  async getTasksByAction(actionName: string): Promise<Task[]> {
    if (!sqlite.isAvailable) {
      return this.memoryTasks.filter(task => task.actionName === actionName);
    }
    
    try {
      const tasks = await sqlGetTasksByAction(actionName);
      return tasks;
    } catch (error) {
      console.error(`Error getting tasks by action ${actionName}:`, error);
      sqlite.isAvailable = false;
      return this.memoryTasks.filter(task => task.actionName === actionName);
    }
  }

  /**
   * Purges all completed tasks
   */
  async purgeCompletedTasks(): Promise<void> {
    if (!sqlite.isAvailable) {
      this.memoryTasks = this.memoryTasks.filter(task => !task.completed);
      return;
    }
    
    try {
      await sqlPurgeCompletedTasks();
    } catch (error) {
      console.error('Error purging completed tasks:', error);
      sqlite.isAvailable = false;
      
      // Fallback to in-memory
      this.memoryTasks = this.memoryTasks.filter(task => !task.completed);
    }
  }

  /**
   * Updates a task in the database
   * @param task The task to update
   * @returns The updated task
   */
  async updateTask(task: Task): Promise<Task> {
    // Use pushTask since it handles both insert and update
    return await this.pushTask(task);
  }
}

export default TaskImplementation;