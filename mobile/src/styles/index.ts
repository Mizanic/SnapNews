import { Colors } from "@/styles/colors";
import { Fonts, Typography } from "@/styles/typography";

export { Typography, Fonts, Colors };

export const Spacing = {
    xxs: 3,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
};

export const Shadows = {
    sm: {
        shadowColor: Colors.light.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: Colors.light.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: Colors.light.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    xl: {
        shadowColor: Colors.light.black,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
};

export const Layout = {
    window: {
        width: "100%",
        height: "100%",
    },
    container: {
        paddingHorizontal: Spacing.md,
    },
    safeArea: {
        flex: 1,
    },
};

export const Animation = {
    timing: {
        fast: 200,
        normal: 300,
        slow: 500,
    },
    easing: {
        easeInOut: "easeInOut",
        easeIn: "easeIn",
        easeOut: "easeOut",
    },
};

// Legacy Theme export (deprecated - import individual modules instead)
/** @deprecated Import specific modules like Colors, Typography, etc. directly */
export const Theme = {
    Colors,
    Fonts,
    Typography,
    Spacing,
    BorderRadius,
    Shadows,
    Layout,
    Animation,
};

export default Theme;
