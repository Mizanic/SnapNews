import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
    Haptics.impactAsync(style);
  };

  return { triggerHaptic };
};
