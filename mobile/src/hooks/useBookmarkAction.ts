import { useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "@/lib/state/bookmarkStore";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";
import { NewsItem } from "@/lib/types/newsTypes";

export const useBookmarkAction = (news: NewsItem, isBookmarked: boolean) => {
    const dispatch = useDispatch();
    const { triggerHaptic } = useHaptics();

    const handleBookmarkPress = () => {
        if (!isBookmarked) {
            dispatch(addBookmark(news));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            dispatch(removeBookmark(news.item_hash));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return { handleBookmarkPress };
};
