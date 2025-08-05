import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "./rootReducer";
import { viewCountMiddleware } from "./middleware/viewCountMiddleware";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["bookmarks", "likes"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(viewCountMiddleware));

export const persistor = persistStore(store);

export default store;
