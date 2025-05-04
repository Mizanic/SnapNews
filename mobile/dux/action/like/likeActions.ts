import { LIKE, UNLIKE } from "@/dux/actionTypes";
import { LikeUnlikeActionType } from "@/model/likeUnlikeActionType";

export const addLike = (url_hash:string) => {
  return {
    type: LIKE,
    payload: url_hash,
  };
};

export const removeLike = (url_hash:string) => {
    return {
        type: UNLIKE,
        payload: url_hash,
    };
};