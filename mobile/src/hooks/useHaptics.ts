import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@/lib/state/settingStore";

export const useHaptics = () => {
    const { hapticFeedback } = useSettingsStore();

    const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
        if (hapticFeedback === "enabled") {
            Haptics.impactAsync(style);
        }
    };

    return { triggerHaptic };
};
