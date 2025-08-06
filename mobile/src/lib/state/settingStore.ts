import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, HapticFeedback, Country, Language, COUNTRIES, LANGUAGES } from "@/lib/types/settingsTypes";
import { detectDeviceLocale } from "@/lib/utils/localeDetection";

interface SettingsState {
    theme: Theme;
    hapticFeedback: HapticFeedback;
    country: Country;
    language: Language;
    localeManuallySet: boolean; // Track if user has manually set locale
    setTheme: (theme: Theme) => void;
    setHapticFeedback: (hapticFeedback: HapticFeedback) => void;
    setCountry: (country: Country) => void;
    setLanguage: (language: Language) => void;
    forceDetectLocale: () => void; // Force detection even if manually set
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            theme: "system",
            hapticFeedback: "enabled",
            country: COUNTRIES[0], // Default US - will be overridden by onRehydrateStorage if needed
            language: LANGUAGES[0], // Default English - will be overridden by onRehydrateStorage if needed
            localeManuallySet: false,
            setTheme: (theme: Theme) => set({ theme }),
            setHapticFeedback: (hapticFeedback: HapticFeedback) => set({ hapticFeedback }),
            setCountry: (country: Country) => set({ country, localeManuallySet: true }),
            setLanguage: (language: Language) => set({ language, localeManuallySet: true }),
            forceDetectLocale: () => {
                const deviceLocale = detectDeviceLocale();
                set({
                    country: deviceLocale.country,
                    language: deviceLocale.language,
                    localeManuallySet: true, // Mark as manually set since user explicitly requested detection
                });
            },
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                // Only auto-detect locale if this is the first time (no persisted data) or locale was never manually set
                if (state && !state.localeManuallySet) {
                    const deviceLocale = detectDeviceLocale();
                    state.country = deviceLocale.country;
                    state.language = deviceLocale.language;
                }
            },
        }
    )
);
