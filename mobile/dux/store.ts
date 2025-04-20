import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookmarkReducer from "./reducer/bookmarkReducer";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['bookmarkState'] // only bookmarkState will be persisted
};

const rootReducer = combineReducers({
  bookmarkState: bookmarkReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export default store;