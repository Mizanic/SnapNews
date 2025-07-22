import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: "system",
            hapticFeedback: "enabled",
            country: COUNTRIES[0], // Default to US
            language: LANGUAGES[0], // Default to English
            setTheme: (theme: Theme) => set({ theme }),
            setHapticFeedback: (hapticFeedback: HapticFeedback) => set({ hapticFeedback }),
            setCountry: (country: Country) => set({ country }),
            setLanguage: (language: Language) => set({ language }),
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
