import { combineReducers } from "redux";
import bookmarkReducer from "@/features/bookmarks/state/bookmarksStore";
import likeReducer from "@/features/likes/state/likesStore";

const rootReducer = combineReducers({
    bookmarks: bookmarkReducer,
    likes: likeReducer,
});

export default rootReducer;
