import { useDispatch } from "react-redux";
import { useHaptics } from "@/hooks/useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { share } from "@/lib/state/shareStore";
import { NewsItem } from "@/lib/types/newsTypes";

export const useShareAction = (news: NewsItem, onShare: () => void) => {
    const dispatch = useDispatch();
    const { triggerHaptic } = useHaptics();

    const handleSharePress = () => {
        triggerHaptic(ImpactFeedbackStyle.Medium);
        dispatch(share(news.pk, news.sk));
        onShare();
    };

    return { handleSharePress };
};
