import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bookmarkReducer from "./reducer/bookmarkReducer";
import LikeReducer from "./reducer/like/likeReducer";
import { likeEventMiddleware } from "./middleware/likeEventMiddleware";


const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["bookmarks", "likes"],
};

const rootReducer = combineReducers({
  bookmarks: bookmarkReducer,
  likes: LikeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(likeEventMiddleware)
);

export const persistor = persistStore(store);

export default store;
