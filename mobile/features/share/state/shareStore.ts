import { SHARE } from "@/store/actionTypes";

export const share = (pk: string, sk: string) => {
    return {
        type: SHARE,
        payload: {
            pk,
            sk
        }
    };
};