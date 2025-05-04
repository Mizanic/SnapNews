// likeMiddleware.ts
import { Middleware } from 'redux';
import { LIKE, UNLIKE } from '@/dux/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAILED_LIKE_EVENTS_KEY = 'FAILED_LIKE_EVENTS';

export const likeEventMiddleware: Middleware = store => next => async action => {
  next(action); // Optimistic update

  if (action.type === LIKE || action.type === UNLIKE) {
    const url = action.type === LIKE ? '/api/like' : '/api/unlike';

    try {
      await retryAsync(() => fakeApiCall(url, { url_hash: action.payload }), 3, 300);
      console.log(`✅ ${action.type} synced to server`);
    } catch (error) {
      console.error(`❌ Failed to sync ${action.type} after 3 attempts:`, error);
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
        const delay = baseDelay * 2 ** attempt; // Exponential backoff
        console.warn(`⚠️ Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
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
        reject(new Error('Network Error'));
      }, 500)
    );
  };
  