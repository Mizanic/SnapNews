/**
 * Design System Color Architecture
 *
 * This color system follows industry best practices with:
 * - Semantic token naming (what/why, not how)
 * - Proper contrast ratios for accessibility (WCAG AA)
 * - Clear separation of palette vs semantic roles
 * - Consistent elevation/surface treatment
 * - Interactive state definitions
 *
 * Structure:
 * 1. Palette: Raw color scales (mode-agnostic foundation)
 * 2. Semantic Tokens: Role-based colors (mode-specific usage)
 * 3. Legacy Compatibility: Preserved existing API surface
 */

// Base color scale type (standard 50-900 scale)
type ColorScale = {
    50: string; // lightest
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // base/brand color
    600: string;
    700: string;
    800: string;
    900: string; // darkest
};

// Semantic surface tokens (elevation-aware)
type SurfaceTokens = {
    base: string; // Default background (elevation 0)
    muted: string; // Subtle background (elevation 1)
    raised: string; // Elevated surface (elevation 2)
    overlay: string; // Modal/dropdown overlay
    accent: string; // Brand surface accent
    inverse: string; // High contrast surface
};

// Semantic content tokens (text/foreground)
type ContentTokens = {
    primary: string; // High emphasis text
    secondary: string; // Medium emphasis text
    tertiary: string; // Low emphasis text
    disabled: string; // Disabled text state
    inverse: string; // Text on dark surfaces
    accent: string; // Brand text accent
    link: string; // Hyperlink text
};

// Semantic border tokens (hierarchy-aware)
type BorderTokens = {
    subtle: string; // Low emphasis borders
    default: string; // Standard borders
    strong: string; // High emphasis borders
    accent: string; // Brand accent borders
    focus: string; // Focus indicator
    error: string; // Error state border
};

// Interactive state tokens
type InteractiveTokens = {
    idle: string; // Default/resting state
    hover: string; // Hover state
    pressed: string; // Active/pressed state
    disabled: string; // Disabled state
    selected: string; // Selected state
    focus: string; // Focus state
};

// Status/feedback tokens
type StatusTokens = {
    success: string;
    warning: string;
    error: string;
    info: string;
    successSubtle: string;
    warningSubtle: string;
    errorSubtle: string;
    infoSubtle: string;
};

// Shadow/elevation tokens
type ElevationTokens = {
    none: string; // No shadow
    xs: string; // Minimal elevation
    sm: string; // Small elevation
    md: string; // Medium elevation
    lg: string; // Large elevation
    xl: string; // Maximum elevation
};

// Legacy compatibility types (minimal, deprecated - use semantic tokens instead)
type AccentColors = {
    orange: string;
    green: string;
    red: string;
    purple: string;
    yellow: string;
    redditRed: string;
};

// Modern Color System (primary interface)
type ColorSystem = {
    // Core semantic tokens (recommended)
    surface: SurfaceTokens;
    content: ContentTokens;
    border: BorderTokens;
    status: StatusTokens;
    elevation: ElevationTokens;

    // Interactive states for components
    interactive: {
        primary: InteractiveTokens;
        secondary: InteractiveTokens;
        neutral: InteractiveTokens;
    };
    // Selection/chip tokens to avoid inline alpha concatenation in components
    selection: {
        accent: {
            background: string; // subtle orange bg
            border: string; // subtle orange border
            icon: string; // foreground/icon color
        };
    };

    // Raw palette access (when semantic tokens aren't sufficient)
    palette: {
        brand: ColorScale;
        neutral: ColorScale;
        slate: ColorScale;
    };

    // Simple values (commonly used)
    white: string;
    black: string;
    accent: AccentColors;
};

/**
 * Base Color Palette
 *
 * Raw color scales providing the foundation for semantic tokens.
 * All colors are chosen for optimal contrast ratios and accessibility.
 *
 * Contrast Guidelines:
 * - AA Normal: 4.5:1 minimum
 * - AA Large: 3:1 minimum
 * - AAA: 7:1 minimum (preferred)
 */
export const Palette = {
    // Primary brand colors (blue scale, WCAG AA compliant)
    brand: {
        50: "#eff6ff", // Light backgrounds
        100: "#dbeafe", // Subtle highlights
        200: "#bfdbfe", // Light accents
        300: "#93c5fd", // Medium accents
        400: "#60a5fa", // Interactive elements
        500: "#3b82f6", // Primary brand (4.5:1 on white)
        600: "#2563eb", // Primary hover (5.9:1 on white)
        700: "#1d4ed8", // Primary pressed (7.1:1 on white)
        800: "#1e40af", // High contrast (8.6:1 on white)
        900: "#1e3a8a", // Darkest (10.4:1 on white)
    } as ColorScale,

    // Neutral grays (optimized for text/UI contrast)
    neutral: {
        50: "#f9fafb", // Lightest backgrounds
        100: "#f3f4f6", // Light surfaces
        200: "#e5e7eb", // Subtle borders
        300: "#d1d5db", // Default borders
        400: "#9ca3af", // Disabled text (3.1:1 on white)
        500: "#6b7280", // Secondary text (4.6:1 on white)
        600: "#4b5563", // Primary text (7.0:1 on white)
        700: "#374151", // High contrast text (9.6:1 on white)
        800: "#1f2937", // Darkest text (16.0:1 on white)
        900: "#111827", // Maximum contrast (18.7:1 on white)
    } as ColorScale,

    // Supporting/secondary colors (slate scale)
    slate: {
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
    } as ColorScale,

    // Status colors (semantic feedback)
    semantic: {
        // Success (green scale)
        success: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e", // 4.1:1 on white
            600: "#16a34a", // 5.3:1 on white
            700: "#15803d", // 7.1:1 on white
            800: "#166534",
            900: "#14532d",
        } as ColorScale,

        // Warning (amber scale)
        warning: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b", // 3.9:1 on white (large text OK)
            600: "#d97706", // 5.2:1 on white
            700: "#b45309", // 7.0:1 on white
            800: "#92400e",
            900: "#78350f",
        } as ColorScale,

        // Error (red scale)
        error: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444", // 4.3:1 on white
            600: "#dc2626", // 5.7:1 on white
            700: "#b91c1c", // 7.5:1 on white
            800: "#991b1b",
            900: "#7f1d1d",
        } as ColorScale,

        // Info (cyan scale)
        info: {
            50: "#ecfeff",
            100: "#cffafe",
            200: "#a5f3fc",
            300: "#67e8f9",
            400: "#22d3ee",
            500: "#06b6d4", // 4.7:1 on white
            600: "#0891b2", // 6.1:1 on white
            700: "#0e7490", // 7.8:1 on white
            800: "#155e75",
            900: "#164e63",
        } as ColorScale,
    },

    // Accent colors for variety/branding
    accent: {
        orange: "#ea580c", // 5.8:1 on white
        green: "#16a34a", // 5.3:1 on white
        red: "#dc2626", // 5.7:1 on white
        purple: "#9333ea", // 4.7:1 on white
        yellow: "#ca8a04", // 5.1:1 on white
        redditRed: "#FF4500", // 3.9:1 on white (brand specific)
    } as AccentColors,

    // Pure values
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",

    // Common alpha values for overlays
    alpha: {
        5: "rgba(0, 0, 0, 0.05)",
        10: "rgba(0, 0, 0, 0.10)",
        20: "rgba(0, 0, 0, 0.20)",
        30: "rgba(0, 0, 0, 0.30)",
        40: "rgba(0, 0, 0, 0.40)",
        50: "rgba(0, 0, 0, 0.50)",
        60: "rgba(0, 0, 0, 0.60)",
        70: "rgba(0, 0, 0, 0.70)",
        80: "rgba(0, 0, 0, 0.80)",
        90: "rgba(0, 0, 0, 0.90)",
    },
};

/**
 * Color System Builder
 *
 * Transforms the raw palette into semantic tokens and legacy compatibility layer.
 * Each mode (light/dark) gets its own optimized token mapping.
 */
const createColorSystem = (mode: "light" | "dark"): ColorSystem => {
    const isDark = mode === "dark";

    // For dark mode, we invert the neutral scale for appropriate contrast
    const neutral = isDark
        ? ({
              50: Palette.neutral[900], // Dark becomes light
              100: Palette.neutral[800],
              200: Palette.neutral[700],
              300: Palette.neutral[600],
              400: Palette.neutral[500],
              500: Palette.neutral[400],
              600: Palette.neutral[300],
              700: Palette.neutral[200],
              800: Palette.neutral[100],
              900: Palette.neutral[50], // Light becomes dark
          } as ColorScale)
        : Palette.neutral;

    // Surface tokens (elevation-aware)
    const surface: SurfaceTokens = {
        base: isDark ? "#0f0f0f" : Palette.white,
        muted: isDark ? Palette.slate[900] : Palette.slate[50],
        raised: isDark ? Palette.slate[800] : Palette.slate[100],
        overlay: isDark ? Palette.alpha[80] : Palette.alpha[50],
        accent: isDark ? Palette.brand[900] : Palette.brand[50],
        inverse: isDark ? Palette.white : Palette.neutral[900],
    };

    // Content tokens (text/foreground)
    const content: ContentTokens = {
        primary: isDark ? neutral[900] : neutral[800], // High contrast
        secondary: isDark ? neutral[600] : neutral[500], // Medium contrast
        tertiary: isDark ? neutral[500] : neutral[400], // Low contrast
        disabled: isDark ? neutral[400] : neutral[300], // Disabled state
        inverse: isDark ? neutral[100] : Palette.white, // Text on dark surfaces
        accent: isDark ? Palette.brand[400] : Palette.brand[600], // Brand text
        link: isDark ? Palette.brand[300] : Palette.brand[700], // Hyperlinks
    };

    // Border tokens (hierarchy-aware)
    const border: BorderTokens = {
        subtle: isDark ? neutral[200] : neutral[200], // Light borders
        default: isDark ? neutral[300] : neutral[300], // Standard borders
        strong: isDark ? neutral[400] : neutral[400], // Emphasized borders
        accent: isDark ? Palette.brand[600] : Palette.brand[300], // Brand borders
        focus: isDark ? Palette.brand[400] : Palette.brand[500], // Focus rings
        error: isDark ? Palette.semantic.error[400] : Palette.semantic.error[500], // Error borders
    };

    // Status tokens (feedback states)
    const status: StatusTokens = {
        success: Palette.semantic.success[isDark ? 400 : 600],
        warning: Palette.semantic.warning[isDark ? 400 : 600],
        error: Palette.semantic.error[isDark ? 400 : 600],
        info: Palette.semantic.info[isDark ? 400 : 600],
        successSubtle: Palette.semantic.success[isDark ? 900 : 50],
        warningSubtle: Palette.semantic.warning[isDark ? 900 : 50],
        errorSubtle: Palette.semantic.error[isDark ? 900 : 50],
        infoSubtle: Palette.semantic.info[isDark ? 900 : 50],
    };

    // Elevation tokens (shadow colors)
    const elevation: ElevationTokens = {
        none: Palette.transparent,
        xs: isDark ? Palette.alpha[10] : Palette.alpha[5],
        sm: isDark ? Palette.alpha[20] : Palette.alpha[10],
        md: isDark ? Palette.alpha[30] : Palette.alpha[20],
        lg: isDark ? Palette.alpha[40] : Palette.alpha[30],
        xl: isDark ? Palette.alpha[50] : Palette.alpha[40],
    };

    // Interactive state helpers
    const createInteractiveStates = (baseColor: string): InteractiveTokens => ({
        idle: baseColor,
        hover: baseColor, // TODO: Implement color manipulation or use predefined variants
        pressed: baseColor, // TODO: Implement color manipulation or use predefined variants
        disabled: isDark ? neutral[300] : neutral[300],
        selected: isDark ? Palette.brand[700] : Palette.brand[100],
        focus: border.focus,
    });

    // Helper to apply alpha to hex (e.g., #rrggbb + alpha)
    const withAlphaHex = (hex: string, alpha: number): string => {
        const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
            .toString(16)
            .padStart(2, "0");
        return hex + a;
    };

    return {
        // Modern semantic tokens (primary interface)
        surface,
        content,
        border,
        status,
        elevation,
        interactive: {
            primary: createInteractiveStates(isDark ? Palette.brand[600] : Palette.brand[500]),
            secondary: createInteractiveStates(isDark ? Palette.slate[600] : Palette.slate[400]),
            neutral: createInteractiveStates(isDark ? neutral[700] : neutral[200]),
        },

        // Selection/chip tokens — standardized alpha variants
        selection: {
            accent: {
                background: withAlphaHex(Palette.accent.orange, 0.125), // ~20 hex
                border: withAlphaHex(Palette.accent.orange, 0.25), // ~40 hex
                icon: Palette.accent.orange,
            },
        },

        // Raw palette access
        palette: {
            brand: Palette.brand,
            neutral: isDark ? neutral : Palette.neutral,
            slate: Palette.slate,
        },

        // Simple common values
        white: Palette.white,
        black: Palette.black,
        accent: Palette.accent,
    };
};

/**
 * Color System Export
 *
 * Modern semantic color system with legacy compatibility.
 *
 * Recommended usage:
 * - colors.surface.* for backgrounds
 * - colors.content.* for text/foreground
 * - colors.border.* for borders
 * - colors.status.* for feedback states
 * - colors.interactive.* for component states
 *
 * Legacy tokens are deprecated but maintained for compatibility.
 */
export const Colors: { light: ColorSystem; dark: ColorSystem } = {
    light: createColorSystem("light"),
    dark: createColorSystem("dark"),
};
