import { combineReducers } from "redux";
import bookmarkReducer from "@/lib/state/bookmarkStore";
import likeReducer from "@/lib/state/likeStore";

const rootReducer = combineReducers({
    bookmarks: bookmarkReducer,
    likes: likeReducer,
});

export default rootReducer;
