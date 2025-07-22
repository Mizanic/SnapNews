import { create } from "zustand";
import { Theme, HapticFeedback, Country, Language, COUNTRIES, LANGUAGES } from "../types";

interface SettingsState {
    theme: Theme;
    hapticFeedback: HapticFeedback;
    country: Country;
    language: Language;
    setTheme: (theme: Theme) => void;
    setHapticFeedback: (hapticFeedback: HapticFeedback) => void;
    setCountry: (country: Country) => void;
    setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    theme: "system",
    hapticFeedback: "enabled",
    country: COUNTRIES[0], // Default to US
    language: LANGUAGES[0], // Default to English
    setTheme: (theme) => set({ theme }),
    setHapticFeedback: (hapticFeedback) => set({ hapticFeedback }),
    setCountry: (country) => set({ country }),
    setLanguage: (language) => set({ language }),
}));
