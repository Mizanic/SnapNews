import { AnyAction } from "redux";
import { LikeState } from "@/lib/types/likeTypes";

// Action Types
const LIKE = "LIKE";
const UNLIKE = "UNLIKE";

// Actions
export interface LikeActionPayload {
    url_hash: string;
    pk: string;
    sk: string;
}

export const addLike = (payload: LikeActionPayload) => {
    return {
        type: LIKE,
        payload,
    };
};

export const removeLike = (payload: LikeActionPayload) => {
    return {
        type: UNLIKE,
        payload,
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
                [action.payload.url_hash]: true,
            };

        case UNLIKE:
            const newState = { ...state };
            delete newState[action.payload.url_hash];
            return newState;

        default:
            return state;
    }
};

export default LikeReducer;
