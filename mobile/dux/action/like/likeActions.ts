import { LIKE, UNLIKE } from "@/dux/actionTypes";
import { LikeUnlikeActionType } from "@/model/likeUnlikeActionType";

export const addLike = (news_hash:string) : LikeUnlikeActionType => {
  return {
    type: LIKE,
    payload: news_hash,
  };
};

export const removeLike = (news_hash:string) : LikeUnlikeActionType => {
    return {
        type: UNLIKE,
        payload: news_hash,
    };
};