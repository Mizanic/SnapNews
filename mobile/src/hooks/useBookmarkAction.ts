import { useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "@/lib/state/bookmarkStore";
import { useHaptics } from "@/hooks/useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { NewsItem } from "@/lib/types/newsTypes";

export const useBookmarkAction = (news: NewsItem, isBookmarked: boolean) => {
    const dispatch = useDispatch();
    const { triggerHaptic } = useHaptics();

    const handleBookmarkPress = () => {
        if (!isBookmarked) {
            dispatch(addBookmark(news));
            triggerHaptic(ImpactFeedbackStyle.Medium);
        } else {
            dispatch(removeBookmark(news.item_hash));
            triggerHaptic(ImpactFeedbackStyle.Light);
        }
    };

    return { handleBookmarkPress };
};
