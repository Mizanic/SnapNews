import { SHARE } from "@/lib/types/actionTypes";

export const share = (pk: string, sk: string) => {
    return {
        type: SHARE,
        payload: {
            pk,
            sk,
        },
    };
};
