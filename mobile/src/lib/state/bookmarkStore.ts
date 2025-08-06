import { AnyAction } from "redux";
import { NewsItem } from "@/lib/types/newsTypes";

// Action Types
const ADD_BOOKMARK = "ADD_BOOKMARK";
const REMOVE_BOOKMARK = "REMOVE_BOOKMARK";

// Actions
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
        payload: item_hash,
    };
};

// Initial State
const bookmarkInitialState: { [key: string]: NewsItem } = {};

// Reducer
const bookmarkReducer = (state = bookmarkInitialState, action: AnyAction): { [key: string]: NewsItem } => {
    switch (action.type) {
        case ADD_BOOKMARK:
            return {
                ...action.payload,
                ...state,
            };
        case REMOVE_BOOKMARK:
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        default:
            return state;
    }
};

export default bookmarkReducer;
