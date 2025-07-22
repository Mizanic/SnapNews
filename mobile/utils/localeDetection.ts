import * as Localization from "expo-localization";
import { Country, Language, COUNTRIES, LANGUAGES, findCountryByCode, findLanguageByCode } from "@/features/settings/types";

/**
 * Detects the device's locale and returns appropriate country and language
 */
export const detectDeviceLocale = () => {
    try {
        // Get the device locale (e.g., "en-US", "es-ES", "fr-FR")
        const locale = Localization.getLocales()[0];

        if (!locale) {
            return getDefaultLocale();
        }

        // Extract language code (e.g., "en" from "en-US")
        const languageCode = locale.languageCode?.toLowerCase();

        // Extract region code (e.g., "US" from "en-US")
        const regionCode = locale.regionCode?.toUpperCase();

        // Find matching country and language
        const detectedCountry = regionCode ? findCountryByCode(regionCode) : null;
        const detectedLanguage = languageCode ? findLanguageByCode(languageCode) : null;

        return {
            country: detectedCountry || getDefaultCountry(),
            language: detectedLanguage || getDefaultLanguage(),
            wasDetected: {
                country: !!detectedCountry,
                language: !!detectedLanguage,
            },
        };
    } catch (error) {
        console.warn("Failed to detect device locale:", error);
        return getDefaultLocale();
    }
};

/**
 * Returns default locale when detection fails
 */
const getDefaultLocale = () => ({
    country: getDefaultCountry(),
    language: getDefaultLanguage(),
    wasDetected: {
        country: false,
        language: false,
    },
});

/**
 * Returns default country (US)
 */
const getDefaultCountry = (): Country => {
    return COUNTRIES[0]; // US
};

/**
 * Returns default language (English)
 */
const getDefaultLanguage = (): Language => {
    return LANGUAGES[0]; // English
};

/**
 * Gets a user-friendly string describing what was detected
 */
export const getLocaleDetectionSummary = (wasDetected: { country: boolean; language: boolean }) => {
    if (wasDetected.country && wasDetected.language) {
        return "Detected from device settings";
    } else if (wasDetected.country || wasDetected.language) {
        return "Partially detected from device";
    } else {
        return "Using default settings";
    }
};
