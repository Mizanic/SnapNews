import { useDispatch } from "react-redux";
import { addLike, removeLike } from "@/lib/state/likeStore";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";
import { NewsItem } from "@/lib/types/newsTypes";

export const useLikeAction = (news: NewsItem, isLiked: boolean) => {
    const dispatch = useDispatch();
    const { triggerHaptic } = useHaptics();

    const handleLikePress = () => {
        const payload = {
            url_hash: news.item_hash,
            pk: news.pk,
            sk: news.sk,
        };
        if (!isLiked) {
            dispatch(addLike(payload));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            dispatch(removeLike(payload));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return { handleLikePress };
};
