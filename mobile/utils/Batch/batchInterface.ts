import { BatchItem } from "./types/batchTypes";

interface BatchInterface {
    enqueue(batchItem: BatchItem): BatchItem;
    flush(): void;
}

export default BatchInterface;