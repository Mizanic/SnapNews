// redux/reducers/bookmarkReducer.ts
import { ADD_BOOKMARK, REMOVE_BOOKMARK } from "../actionTypes";
import { NewsItem } from "../../model/newsItem";
import { initialState } from "../initialState";

interface BookmarkState {
  bookmarks: { [key: string]: NewsItem };
}


const bookmarkReducer = (state = initialState, action: any): BookmarkState => {
  switch (action.type) {
    case ADD_BOOKMARK:
      return {
        ...state,
        bookmarks: {
          ...action.payload,
          ...state.bookmarks,
        }        
      };
    case REMOVE_BOOKMARK:
      const newBookmarks = { ...state.bookmarks };
      delete newBookmarks[action.payload];
      return {
        ...state,
        bookmarks: newBookmarks,
      };
    default:
      return state;
  }
};

export default bookmarkReducer;
