import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { useSettingsStore } from "@/features/settings/state/settingsStore";
import { Colors } from "@/constants/Colors";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
    colorScheme: ColorScheme;
    colors: typeof Colors.light;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useSystemColorScheme();
    const { theme } = useSettingsStore();
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

    useEffect(() => {
        let resolvedScheme: ColorScheme;

        if (theme === "system") {
            resolvedScheme = systemColorScheme === "dark" ? "dark" : "light";
        } else {
            resolvedScheme = theme as ColorScheme;
        }

        setColorScheme(resolvedScheme);
    }, [theme, systemColorScheme]);

    const colors = Colors[colorScheme];
    const isDark = colorScheme === "dark";

    const value: ThemeContextType = {
        colorScheme,
        colors,
        isDark,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
