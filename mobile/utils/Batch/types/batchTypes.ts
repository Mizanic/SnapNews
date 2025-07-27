export interface BatchItem {
  payload: {
    pk: string;
    sk: string;
  };
  date: Date;
}


export interface Batch {
    batchId: string;
    queue: BatchItem[];
}