import Task from "./Task";

interface TaskInterface {
    pushTask(task: Task): Promise<Task>;  // Now returns the task with its ID
    getAllTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    deleteTaskById(id: string): Promise<void>;
    getIncompleteTaskCount(): Promise<number>;
    getIncompleteTask(): Promise<Task[]>;
    getTasksByAction(actionName: string): Promise<Task[]>;
    purgeCompletedTasks(): Promise<void>;
    updateTask(task: Task): Promise<Task>;  // Also returns the updated task
}

export default TaskInterface;