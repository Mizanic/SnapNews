import { AnyAction } from "redux";
import { LikeState } from "@/features/likes/types";

// Action Types
const LIKE = "LIKE";
const UNLIKE = "UNLIKE";

// Actions
export const addLike = (item_hash: string) => {
    return {
        type: LIKE,
        payload: item_hash,
    };
};

export const removeLike = (item_hash: string) => {
    return {
        type: UNLIKE,
        payload: item_hash,
    };
};

// Initial State
const likeInitialState: LikeState = {};

// Reducer
const LikeReducer = (state: LikeState = likeInitialState, action: AnyAction): LikeState => {
    switch (action.type) {
        case LIKE:
            return {
                ...state,
                [action.payload]: true,
            };

        case UNLIKE:
            const newState = { ...state };
            delete newState[action.payload];
            return newState;

        default:
            return state;
    }
};

export default LikeReducer;
