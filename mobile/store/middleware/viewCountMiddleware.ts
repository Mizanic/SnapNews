import { Middleware } from 'redux';
import { ADD_BOOKMARK, LIKE, SHARE } from '@/store/actionTypes';
import batch from '@/utils/Batch/invokeBatch';
import { TELEMETRY_API_URL } from '@/globalConfig';
import axios from 'axios';
import { sharedQueryClient } from '@/utils/sharedQueryClient';

const queryClient = sharedQueryClient;

const sendBatchToTelemetry = async (batchData: any) => {
  const response = await axios.post(TELEMETRY_API_URL, batchData, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });
  return response.data;
};

export const viewCountMiddleware: Middleware = store => next => async (action: any) => {
  next(action);

  if (action.type === LIKE || action.type === ADD_BOOKMARK || action.type === SHARE) {
    const batchResponse = batch.enqueue(batch.convertToBatchItem(action));
    console.info(`Batch queue: ${JSON.stringify(batchResponse.batch)}`);

    if (batchResponse.isFlushed && batchResponse.batch) {
      console.log('Flushing batch to API...');

      try {
        console.log('Sending batch to telemetry API');
        await queryClient.getMutationCache().build(queryClient, {
          mutationFn: sendBatchToTelemetry
        }).execute(batchResponse.batch);
        
      } catch (error) {
        console.error('Error sending batch to telemetry API:', error);
        // Retry or local caching logic can go here
      }
    }
  }
};
