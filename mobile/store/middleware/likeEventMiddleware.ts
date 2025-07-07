// likeMiddleware.ts
import { Middleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LIKE,
  UNLIKE,
} from '@/store/actionTypes';
import { BASE_RETRY_DELAY_MS, FAILED_LIKE_EVENTS_KEY, LIKE_API_URL, MAX_RETRY_ATTEMPTS, UNLIKE_API_URL } from '@/globalConfig';


export const likeEventMiddleware: Middleware = store => next => async (action: any) => {
  next(action);

  if (action.type === LIKE || action.type === UNLIKE) {
    const url = action.type === LIKE ? LIKE_API_URL : UNLIKE_API_URL;

    try {
      await retryAsync(() => fakeApiCall(url, { item_hash: action.payload }), MAX_RETRY_ATTEMPTS, BASE_RETRY_DELAY_MS);
      console.log(`${action.type} synced to server`);
    } catch (error) {
      console.error(`Failed to sync ${action.type} after ${MAX_RETRY_ATTEMPTS} attempts:`, error);
      await storeFailedEvent({ type: action.type, payload: action.payload });
    }
  }
};


const retryAsync = async (
    fn: () => Promise<any>,
    retries: number,
    baseDelay: number
  ): Promise<any> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) throw error;
        const delay = baseDelay * 2 ** attempt;
        console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
        await wait(delay);
      }
    }
  };
  
  const storeFailedEvent = async (event: { type: string; payload: string }) => {
    try {
      const existing = await AsyncStorage.getItem(FAILED_LIKE_EVENTS_KEY);
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push({ ...event, timestamp: Date.now() });
  
      await AsyncStorage.setItem(FAILED_LIKE_EVENTS_KEY, JSON.stringify(parsed));
      console.log('Failed event stored locally');
    } catch (err) {
      console.error('Error saving failed event:', err);
    }
  };
  

  
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fakeApiCall = async (url: string, data: any) => {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        console.log(`[API] Called ${url} with`, data);
        Math.random() < 0.3 ? resolve(true) : reject(new Error('Network Error'));
      }, 500)
    );
  };
  