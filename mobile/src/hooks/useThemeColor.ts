/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Theme } from "@/styles";
import { useTheme } from "@/contexts/ThemeContext";

const useThemeColor = (
    props: { light?: string; dark?: string },
    colorName: keyof typeof Theme.Colors.light & keyof typeof Theme.Colors.dark
) => {
    const { colorScheme } = useTheme();
    const colorFromProps = props[colorScheme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Theme.Colors[colorScheme][colorName];
    }
};

// Hook to get theme-aware colors
export const useThemeColors = () => {
    const { colors } = useTheme();
    return colors;
};

export default useThemeColor;
