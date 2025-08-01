import { BATCH_SIZE } from "@/globalConfig";
import BatchInterface from "./batchInterface";
import { Batch, BatchItem, BatchResponse } from "./types/batchTypes";
import { ADD_BOOKMARK, LIKE } from "@/store/actionTypes";

class BatchImpl implements BatchInterface {
    private batch: Batch;

    constructor() {
        this.batch = { queue: [] };
    }

    private getBatchSize(): number {
        return this.batch.queue.length;
    }

    
public enqueue(batchItem: BatchItem): BatchResponse {
    if (this.getBatchSize() < BATCH_SIZE) {
        this.batch.queue.push(batchItem);
        console.info(`Item added to batch. Current size: ${this.getBatchSize()}`);
    }

    if (this.getBatchSize() === BATCH_SIZE) {
        console.warn("Batch is full");
        return this.flush();
    }

    return { batch: this.batch, isFlushed: false };
}

public flush(): BatchResponse {
    const flushedBatch = { queue: this.batch.queue };
    this.batch.queue = [];
    return { batch: flushedBatch, isFlushed: true };
}

    public convertToBatchItem(action: any): BatchItem {
        const actionType = action.type.toLowerCase().trim();
        const payload = action.payload;
        let pk, sk;
        if (action.type === ADD_BOOKMARK) {
            const firstKey = Object.keys(payload)[0];
            ({ pk, sk } = payload[firstKey] || {});
        } else if (action.type === LIKE) {
            ({ pk, sk } = payload || {});
        }
        return { pk, sk, actionType };
    }
}

export default BatchImpl;