export interface LikeState {
    [key: string]: boolean;
}

export interface LikeUnlikeActionType {
    type: string;
    payload: string;
}
