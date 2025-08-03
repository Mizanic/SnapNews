import Task from "./Task";

/**
 * Interface for executing tasks from the task queue
 */
interface TaskExecutor {    
    /**
     * Executes all tasks in the provided task list.
     * @param taskList List of tasks to execute
     * @returns Array of results from executing all tasks (null for failed/skipped tasks)
     */
    executeAllTasks(taskList: Task[]): Promise<void>;
}

export default TaskExecutor;