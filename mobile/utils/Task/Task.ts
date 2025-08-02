interface Task{
    id: string;
    description: string;
    actionName : string;
    payload : any;
    completed: boolean;
    retryCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export default Task;