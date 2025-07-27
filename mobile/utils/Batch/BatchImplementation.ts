import { BATCH_SIZE } from "@/globalConfig";
import BatchInterface from "./batchInterface";
import { Batch, BatchItem, BatchResponse } from "./types/batchTypes";

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

public convertToBatchItem(payload: { pk: string, sk: string, url_hash: string }): BatchItem {
    console.log(`Converting event to BatchItem: ${JSON.stringify(payload)}`);
    return {
        payload: {
            pk: payload.pk,
            sk: payload.sk
        },
        date: new Date(),
    };
}
}

export default BatchImpl;