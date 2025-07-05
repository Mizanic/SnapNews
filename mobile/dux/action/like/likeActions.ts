import { LIKE, UNLIKE } from "@/dux/actionTypes";

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
