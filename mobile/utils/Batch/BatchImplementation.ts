import { BATCH_SIZE } from "@/globalConfig";
import BatchInterface from "./batchInterface";
import { Batch, BatchItem } from "./types/batchTypes";

class BatchImpl implements BatchInterface {
    private batch: Batch;

    constructor() {
        this.batch = { batchId: crypto.randomUUID() , queue: [] };
    }

    private getBatchSize(): number {
        return this.batch.queue.length;
    }

    
    public enqueue(batchItem: BatchItem): BatchItem {
    if (this.getBatchSize() < BATCH_SIZE) {
        console.info(`${batchItem.payload} has been added to the batch.`);
        this.batch.queue.push(batchItem);
    }

    if (this.getBatchSize() == BATCH_SIZE) {
        console.warn("Batch is full");
        this.flush();
    }

    return batchItem;
}

public flush(): void {
    console.log(`Flushing batch with ID: ${this.batch.batchId}`);
    // Reset batch ID as well
    this.batch = { batchId: crypto.randomUUID(), queue: [] };
}

    

}

export default BatchImpl;