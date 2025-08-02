import { BatchItem, BatchResponse } from "./types/batchTypes";

interface BatchInterface {
    enqueue(batchItem: BatchItem): BatchResponse;
    flush(): BatchResponse;
}

export default BatchInterface;