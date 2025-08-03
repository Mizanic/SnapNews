export interface BatchItem {
    pk: string;
    sk: string;
    actionType: string;
}


export interface Batch {
    queue: BatchItem[];
}

export interface BatchResponse {
    batch: Batch;
    isFlushed: boolean;
}