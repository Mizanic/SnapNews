export const Colors = {
    // Primary Brand Colors
    primary: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9", // Main brand color
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
    background: {
        primary: "#ffffff",
        secondary: "#f8fafc",
        tertiary: "#f1f5f9",
        dark: "#0f172a",
        opaque: "rgba(0, 0, 0, 0.5)",
    },

    // Text Colors
    text: {
        primary: "#1f2937",
        secondary: "#6b7280",
        tertiary: "#9ca3af",
        inverse: "#ffffff",
        accent: "#0ea5e9",
    },

    // Border Colors
    border: {
        light: "#e5e7eb",
        medium: "#d1d5db",
        dark: "#9ca3af",
    },

    // Shadow Colors
    shadow: {
        light: "rgba(0, 0, 0, 0.05)",
        medium: "rgba(0, 0, 0, 0.1)",
        dark: "rgba(0, 0, 0, 0.15)",
    },
};

export const Spacing = {
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
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    xl: {
        shadowColor: Colors.black,
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
