import { BATCH_SIZE } from "@/globalConfig";
import BatchInterface from "./batchInterface";
import { Batch, BatchItem } from "./types/batchTypes";

class BatchImpl implements BatchInterface {
    private batch: Batch;

    constructor() {
        this.batch = { queue: [] };
    }

    private getBatchSize(): number {
        return this.batch.queue.length;
    }

    
    public enqueue(batchItem: BatchItem): BatchItem {
    if (this.getBatchSize() < BATCH_SIZE) {
        console.info(`${batchItem.payload} has been added to the batch.`);
        this.batch.queue.push(batchItem);
        console.log(`Current batch size: ${this.getBatchSize()}`);
        console.log(`Current batch queue: ${JSON.stringify(this.batch.queue)}`);
    }

    if (this.getBatchSize() == BATCH_SIZE) {
        console.warn("Batch is full");
        this.flush();
    }

    return batchItem;
}

public flush(): void {
    console.log(`Flushing batch`);
    console.log("Batch data to send:", JSON.stringify(this.batch.queue));
    this.batch.queue = [];
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