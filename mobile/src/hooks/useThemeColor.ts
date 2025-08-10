/**
 * Theme Color Hooks
 *
 * Provides access to the complete semantic color system.
 * Use useThemeColors() to access all color tokens.
 */

import { useTheme } from "@/contexts/ThemeContext";

/**
 * Get the complete color system for the current theme.
 *
 * @returns ColorSystem with semantic tokens and legacy compatibility
 *
 * @example
 * const colors = useThemeColors();
 * // Modern usage (recommended)
 * backgroundColor: colors.surface.base
 * color: colors.content.primary
 * borderColor: colors.border.subtle
 *
 * // Legacy usage (deprecated but supported)
 * backgroundColor: colors.backgroundColors.primary
 */
export const useThemeColors = () => {
    const { colors } = useTheme();
    return colors;
};

export default useThemeColors;
