import { BATCH_SIZE } from "@/globalConfig";
import BatchInterface from "./batchInterface";
import { Batch, BatchItem, BatchResponse } from "./types/batchTypes";
import { ADD_BOOKMARK, LIKE, SHARE } from "@/store/actionTypes";

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
        console.info(`Creating Batch of ${JSON.stringify(action)}`);
        
        const { type, payload } = action;
        let actionType = type.toLowerCase().trim();
        let pk, sk;
        
        if (type === ADD_BOOKMARK) {
            const firstKey = Object.keys(payload)[0];
            if (payload[firstKey]) {
                ({ pk, sk } = payload[firstKey]);
            }
            actionType = "bookmark";
        } else if (type === LIKE || type === SHARE) {
            ({ pk, sk } = payload || {});
        }
        
        return { pk, sk, actionType };
    }
}

export default BatchImpl;