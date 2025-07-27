export interface BatchItem {
  payload: {
    pk: string;
    sk: string;
  };
  date: Date;
}


export interface Batch {
    queue: BatchItem[];
}