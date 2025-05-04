// likeMiddleware.ts
import { Middleware } from 'redux';
import { LIKE, UNLIKE } from '@/dux/actionTypes';

export const likeEventMiddleware: Middleware = store => next => async action => {
  next(action);

  if (action.type === LIKE) {
    try {
      await retryAsync(() => fakeApiCall('/api/like', { url_hash: action.payload }), 3);
      console.log('✅ Like synced to server');
    } catch (error) {
      console.error('❌ Failed to sync like after 3 attempts:', error);
    }
  }

  if (action.type === UNLIKE) {
    try {
      await retryAsync(() => fakeApiCall('/api/unlike', { url_hash: action.payload }), 3);
      console.log('✅ Unlike synced to server');
    } catch (error) {
      console.error('❌ Failed to sync unlike after 3 attempts:', error);
    }
  }
};


const retryAsync = async (fn: () => Promise<any>, retries: number): Promise<any> => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt === retries) throw error;
        console.warn(`⚠️ Retry attempt ${attempt} failed. Retrying...`);
        await wait(300);
      }
    }
  };
  
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  

  const fakeApiCall = async (url: string, data: any) => {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        console.log(`[API] Called ${url} with`, data);
        Math.random() < 0.7 ? resolve(true) : reject(new Error("Network Error"));
      }, 500)
    );
  };
  