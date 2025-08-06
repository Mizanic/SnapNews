export type Theme = "light" | "dark" | "system";
export type HapticFeedback = "enabled" | "disabled";

export interface Country {
    code: string;
    name: string;
    flag: string;
}

export interface Language {
    code: string;
    name: string;
    nativeName: string;
}

export const COUNTRIES: Country[] = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "KR", name: "South Korea", flag: "🇰🇷" },
    { code: "CN", name: "China", flag: "🇨🇳" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "MX", name: "Mexico", flag: "🇲🇽" },
    { code: "RU", name: "Russia", flag: "🇷🇺" },
];

export const LANGUAGES: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
];

// Helper functions for locale detection
export const findCountryByCode = (code: string): Country | undefined => {
    return COUNTRIES.find((country) => country.code.toLowerCase() === code.toLowerCase());
};

export const findLanguageByCode = (code: string): Language | undefined => {
    return LANGUAGES.find((language) => language.code.toLowerCase() === code.toLowerCase());
};
