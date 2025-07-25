/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

const useThemeColor = (props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) => {
    const { colorScheme } = useTheme();
    const colorFromProps = props[colorScheme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[colorScheme][colorName];
    }
};

// Hook to get theme-aware colors
export const useThemeColors = () => {
    const { colors } = useTheme();
    return colors;
};

export default useThemeColor;
