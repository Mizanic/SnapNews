import Task from "./Task";
import TaskExecutor from "./TaskExecutor";

/**
 * Implementation of TaskExecutor interface for executing pending tasks
 */
class TaskExecutorImplementation implements TaskExecutor {
    async executeAllTasks(taskList: Task[]): Promise<void> {
        
    }
    
}

export default TaskExecutorImplementation;
