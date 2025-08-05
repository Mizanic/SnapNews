import Task from "./Task";

/**
 * Interface for task management (database and in-memory fallback).
 */
interface TaskInterface {
    /**
     * Adds a new task or updates an existing one.
     * @param task The task to add or update
     * @returns The task with its assigned ID
     */
    pushTask(task: Task): Promise<Task>;
    
    /**
     * Gets all tasks.
     * @returns Array of all tasks
     */
    getAllTasks(): Promise<Task[]>;
    
    /**
     * Gets a task by its ID.
     * @param id The ID of the task
     * @returns The task if found, null otherwise
     */
    getTaskById(id: number): Promise<Task | null>;
    
    /**
     * Deletes a task by its ID.
     * @param id The ID of the task
     */
    deleteTaskById(id: number): Promise<void>;
    
    /**
     * Gets a count of incomplete tasks.
     * @returns The number of incomplete tasks
     */
    getIncompleteTaskCount(): Promise<number>;
    
    /**
     * Gets all incomplete tasks.
     * @returns Array of incomplete tasks
     */
    getIncompleteTask(): Promise<Task[]>;
    
    /**
     * Gets all tasks by action name.
     * @param actionName The action name to filter by
     * @returns Array of tasks
     */
    getTasksByAction(actionName: string): Promise<Task[]>;
    
    /**
     * Purges all completed tasks.
     */
    purgeCompletedTasks(): Promise<void>;
    
    /**
     * Updates a task.
     * @param task The task to update
     * @returns The updated task
     */
    updateTask(task: Task): Promise<Task>;
}

export default TaskInterface;