// likeMiddleware.ts
import { Middleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LIKE,
  UNLIKE,
} from '@/store/actionTypes';
import { BASE_RETRY_DELAY_MS, FAILED_LIKE_EVENTS_KEY, LIKE_API_URL, MAX_RETRY_ATTEMPTS, UNLIKE_API_URL } from '@/globalConfig';
import BatchImpl from '@/utils/Batch/BatchImplementation';
import batch from '@/utils/Batch/invokeBatch';


export const likeEventMiddleware: Middleware = store => next => async (action: any) => {
  next(action);

  if (action.type === LIKE || action.type === UNLIKE) {
    const url = action.type === LIKE ? LIKE_API_URL : UNLIKE_API_URL;

    try {
      batch.enqueue(batch.convertToBatchItem(action.payload));
    } catch (error) {
      console.error(`Error dispatching ${action.type} for item:`, action.payload, error);
    }
  }
};
  