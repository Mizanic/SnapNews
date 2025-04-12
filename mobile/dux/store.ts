import { createStore, combineReducers } from "redux";
import bookmarkReducer from "./reducer/bookmarkReducer";

const rootReducer = combineReducers({
  bookmarkState: bookmarkReducer,
});

const store = createStore(rootReducer);

export default store;