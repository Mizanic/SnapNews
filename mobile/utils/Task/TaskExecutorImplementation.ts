import { SCHEDULER_INTERVAL, TELEMETRY_ACTION } from "@/globalConfig";
import Task from "./Task";
import TaskExecutor from "./TaskExecutor";
import taskImpl from "./TaskImplementationInstance";

/**
 * Implementation of TaskExecutor interface for executing pending tasks
 */
class TaskExecutorImplementation implements TaskExecutor {
    private schedulerInterval;
    private taskImpl;

    constructor() {
        this.schedulerInterval = SCHEDULER_INTERVAL;
        this.taskImpl = taskImpl;
    }

    async executeAllTasks(taskList: Task[]): Promise<void> {
        for (const task of taskList) {
            const { id, payload, actionName, completed, retryCount } = task;
            if (!completed && retryCount < 3) {
                console.log(`Executing task ${id}`);
                if(actionName === TELEMETRY_ACTION){
                    console.log(`Its a telemetry task with payload:`, payload);
                }
            }
        }
    }
        
    async invokeScheduler(): Promise<void> {
        setInterval(async () => {
            console.log("Task scheduler invoked at", new Date().toISOString());
            const incompleteTasks = await this.taskImpl.getIncompleteTask();
            if (incompleteTasks.length > 0) {
                console.log(`Found ${incompleteTasks.length} incomplete tasks. Executing...`);
                this.executeAllTasks(incompleteTasks);
            }
        }, this.schedulerInterval);
    }
}

export default TaskExecutorImplementation;
