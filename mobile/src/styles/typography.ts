export const Fonts = {
    // Primary font family for headings and important text
    Primary: {
        light: "Inter-Light",
        regular: "Inter-Regular",
        medium: "Inter-Medium",
        semiBold: "Inter-SemiBold",
        bold: "Inter-Bold",
        extraBold: "Inter-ExtraBold",
    },
    // Secondary font family for body text and general content
    Secondary: {
        regular: "Inter-Regular",
        medium: "Inter-Medium",
        semiBold: "Inter-SemiBold",
    },
    // Accent font for branding
    Accent: {
        regular: "Lora-Regular",
        medium: "Lora-Medium",
        semiBold: "Lora-SemiBold",
        bold: "Lora-Bold",
    },
};

export const Typography = {
    // Display text styles
    display: {
        large: {
            fontFamily: Fonts.Primary.bold,
            fontSize: 36,
            lineHeight: 44,
            letterSpacing: -0.5,
        },
        medium: {
            fontFamily: Fonts.Primary.bold,
            fontSize: 32,
            lineHeight: 40,
            letterSpacing: -0.25,
        },
        small: {
            fontFamily: Fonts.Primary.bold,
            fontSize: 28,
            lineHeight: 36,
            letterSpacing: 0,
        },
    },

    // Heading text styles
    heading: {
        h1: {
            fontFamily: Fonts.Primary.bold,
            fontSize: 24,
            lineHeight: 32,
            letterSpacing: -0.25,
        },
        h2: {
            fontFamily: Fonts.Accent.semiBold,
            fontSize: 20,
            lineHeight: 28,
            letterSpacing: 0,
        },
        h3: {
            fontFamily: Fonts.Accent.semiBold,
            fontSize: 18,
            lineHeight: 26,
            letterSpacing: 0,
        },
        h4: {
            fontFamily: Fonts.Accent.semiBold,
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0,
        },
        h5: {
            fontFamily: Fonts.Primary.medium,
            fontSize: 14,
            lineHeight: 22,
            letterSpacing: 0,
        },
        h6: {
            fontFamily: Fonts.Primary.medium,
            fontSize: 12,
            lineHeight: 20,
            letterSpacing: 0.5,
        },
    },

    // Body text styles
    bodyText: {
        large: {
            fontFamily: Fonts.Secondary.regular,
            fontSize: 18,
            lineHeight: 28,
            letterSpacing: 0,
        },
        medium: {
            fontFamily: Fonts.Secondary.regular,
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0,
        },
        small: {
            fontFamily: Fonts.Secondary.regular,
            fontSize: 14,
            lineHeight: 22,
            letterSpacing: 0,
        },
    },

    // Label text styles
    label: {
        large: {
            fontFamily: Fonts.Secondary.medium,
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0,
        },
        medium: {
            fontFamily: Fonts.Secondary.medium,
            fontSize: 14,
            lineHeight: 22,
            letterSpacing: 0,
        },
        small: {
            fontFamily: Fonts.Secondary.medium,
            fontSize: 12,
            lineHeight: 20,
            letterSpacing: 0.5,
        },
    },

    // Caption and small text
    captionText: {
        large: {
            fontFamily: Fonts.Secondary.regular,
            fontSize: 12,
            lineHeight: 18,
            letterSpacing: 0.5,
        },
        medium: {
            fontFamily: Fonts.Secondary.regular,
            fontSize: 11,
            lineHeight: 16,
            letterSpacing: 0.5,
        },
        small: {
            fontFamily: Fonts.Secondary.regular,
            fontSize: 10,
            lineHeight: 14,
            letterSpacing: 0.5,
        },
    },

    // Button text styles
    button: {
        large: {
            fontFamily: Fonts.Primary.semiBold,
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0.5,
        },
        medium: {
            fontFamily: Fonts.Primary.semiBold,
            fontSize: 14,
            lineHeight: 22,
            letterSpacing: 0.5,
        },
        small: {
            fontFamily: Fonts.Primary.medium,
            fontSize: 12,
            lineHeight: 20,
            letterSpacing: 0.5,
        },
    },
};
