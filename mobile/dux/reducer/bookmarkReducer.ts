import { ADD_BOOKMARK, REMOVE_BOOKMARK } from "../actionTypes";
import { NewsItem } from "../../model/newsItem";
import { bookmarkInitialState } from "../initialState";
import { AnyAction } from "redux";

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
