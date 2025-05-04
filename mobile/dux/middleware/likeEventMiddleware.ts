// likeMiddleware.ts
import { Middleware } from 'redux';
import { LIKE, UNLIKE } from '@/dux/actionTypes';

export const likeEventMiddleware: Middleware = store => next => async action => {
  next(action);

  if (action.type === LIKE) {
    try {
      await fakeApiCall('/api/like', { url_hash: action.payload });
      console.log('✅ Like synced to server');
    } catch (error) {
      console.error('❌ Failed to sync like:', error);
    }
  }

  if (action.type === UNLIKE) {
    try {
      await fakeApiCall('/api/unlike', { url_hash: action.payload });
      console.log('✅ Unlike synced to server');
    } catch (error) {
      console.error('❌ Failed to sync unlike:', error);
    }
  }
};

const fakeApiCall = async (url: string, data: any) => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      console.log(`[API] Called ${url} with`, data);
      reject(new Error("Network Error"));
    }, 500)
  );
};
