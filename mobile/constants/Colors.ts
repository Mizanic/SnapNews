/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
    light: {
        text: "#11181C",
        background: "#fff",
        tint: tintColorLight,
        icon: "#687076",
        tabIconDefault: "#687076",
        tabIconSelected: tintColorLight,

        // Primary Brand Colors
        primary: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
        },

        // Secondary Colors
        secondary: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
        },

        // Accent Colors
        accent: {
            orange: "#ff6b35",
            green: "#10b981",
            red: "#ef4444",
            purple: "#8b5cf6",
            yellow: "#f59e0b",
            redditRed: "#FF4500",
        },

        // Semantic Colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // Neutral Colors
        white: "#ffffff",
        black: "#000000",
        gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
        },

        // Background Colors
        backgroundColors: {
            primary: "#ffffff",
            secondary: "#f8fafc",
            tertiary: "#f1f5f9",
            opaque: "rgba(0, 0, 0, 0.5)",
        },

        // Text Colors
        textColors: {
            primary: "#1f2937",
            secondary: "#6b7280",
            tertiary: "#9ca3af",
            inverse: "#ffffff",
            accent: "#0ea5e9",
        },

        // Border Colors
        borderColors: {
            light: "#e5e7eb",
            medium: "#d1d5db",
            dark: "#9ca3af",
        },

        // Shadow Colors
        shadowColors: {
            light: "rgba(0, 0, 0, 0.05)",
            medium: "rgba(0, 0, 0, 0.1)",
            dark: "rgba(0, 0, 0, 0.15)",
        },
    },
    dark: {
        text: "#ECEDEE",
        background: "#151718",
        tint: tintColorDark,
        icon: "#9BA1A6",
        tabIconDefault: "#9BA1A6",
        tabIconSelected: tintColorDark,

        // Primary Brand Colors (slightly adjusted for dark mode)
        primary: {
            50: "#0c4a6e",
            100: "#075985",
            200: "#0369a1",
            300: "#0284c7",
            400: "#0ea5e9",
            500: "#38bdf8",
            600: "#7dd3fc",
            700: "#bae6fd",
            800: "#e0f2fe",
            900: "#f0f9ff",
        },

        // Secondary Colors (inverted for dark mode)
        secondary: {
            50: "#0f172a",
            100: "#1e293b",
            200: "#334155",
            300: "#475569",
            400: "#64748b",
            500: "#94a3b8",
            600: "#cbd5e1",
            700: "#e2e8f0",
            800: "#f1f5f9",
            900: "#f8fafc",
        },

        // Accent Colors (same as light mode)
        accent: {
            orange: "#ff6b35",
            green: "#10b981",
            red: "#ef4444",
            purple: "#8b5cf6",
            yellow: "#f59e0b",
            redditRed: "#FF4500",
        },

        // Semantic Colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // Neutral Colors
        white: "#ffffff",
        black: "#000000",
        gray: {
            50: "#111827",
            100: "#1f2937",
            200: "#374151",
            300: "#4b5563",
            400: "#6b7280",
            500: "#9ca3af",
            600: "#d1d5db",
            700: "#e5e7eb",
            800: "#f3f4f6",
            900: "#f9fafb",
        },

        // Background Colors
        backgroundColors: {
            primary: "#151718",
            secondary: "#1e293b",
            tertiary: "#334155",
            opaque: "rgba(0, 0, 0, 0.7)",
        },

        // Text Colors
        textColors: {
            primary: "#f9fafb",
            secondary: "#d1d5db",
            tertiary: "#9ca3af",
            inverse: "#1f2937",
            accent: "#38bdf8",
        },

        // Border Colors
        borderColors: {
            light: "#374151",
            medium: "#4b5563",
            dark: "#6b7280",
        },

        // Shadow Colors
        shadowColors: {
            light: "rgba(0, 0, 0, 0.2)",
            medium: "rgba(0, 0, 0, 0.3)",
            dark: "rgba(0, 0, 0, 0.4)",
        },
    },
};
