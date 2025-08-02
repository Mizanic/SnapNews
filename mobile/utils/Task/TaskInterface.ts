import Task from "./Task";

interface TaskInterface {
    pushTask(task: Task): Promise<void>;
    getAllTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    deleteTaskById(id: string): Promise<void>;
    getIncompleteTaskCount(): Promise<number>;
    getIncompleteTask(): Promise<Task[]>;
    getTasksByAction(actionName: string): Promise<Task[]>;
    purgeCompletedTasks(): Promise<void>;
    updateTask(task: Task): Promise<void>;
}

export default TaskInterface;