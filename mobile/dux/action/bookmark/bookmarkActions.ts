// redux/actions/bookmarkActions.ts
import { NewsItem } from "../../../model/newsItem";
import { ADD_BOOKMARK, REMOVE_BOOKMARK } from "../../actionTypes";

export const addBookmark = (newsItem: NewsItem) => {
  return {
    type: ADD_BOOKMARK,
    payload: {
      [newsItem.item_hash]: { ...newsItem },
    },
  };
};

export const removeBookmark = (item_hash: string) => {
  return {
    type: REMOVE_BOOKMARK,
    payload : item_hash,
  };
};
