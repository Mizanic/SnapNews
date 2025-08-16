import * as Localization from "expo-localization";
import { Country, Language, COUNTRIES, LANGUAGES, findCountryByCode, findLanguageByCode } from "@/lib/types/settingsTypes";

/**
 * Detects the device's locale and returns appropriate country and language
 */
export const detectDeviceLocale = () => {
    try {
        // Get all device locales
        const locales = Localization.getLocales();
        const primaryLocale = locales[0];

        if (!primaryLocale) {
            return getDefaultLocale();
        }

        // Strategy 1: Get language from the primary locale
        const languageCode = primaryLocale.languageCode?.toLowerCase();

        // Strategy 2: Try multiple approaches for country detection
        let detectedCountryCode = null;

        // Method A: Use Localization.region (primary method)
        const region = Localization.getLocales()[0].regionCode;
        detectedCountryCode = region;

        // Method B: If region doesn't match our countries, try regionCode from primary locale
        if (!detectedCountryCode || !findCountryByCode(detectedCountryCode)) {
            detectedCountryCode = primaryLocale.regionCode;
        }

        // Method D: Try currency code as last resort
        if (!detectedCountryCode || !findCountryByCode(detectedCountryCode)) {
            const currencyCode = primaryLocale.currencyCode;
            if (currencyCode) {
                const currencyCountry = getCountryFromCurrency(currencyCode);
                if (currencyCountry) {
                    detectedCountryCode = currencyCountry;
                }
            }
        }

        // Find matching country and language
        const detectedCountry = detectedCountryCode ? findCountryByCode(detectedCountryCode) : null;
        const detectedLanguage = languageCode ? findLanguageByCode(languageCode) : null;

        // Enhanced logging for debugging
        // console.log("🌍 Locale Detection Debug:", {
        //     "Localization.region": region,
        //     "primaryLocale.regionCode": primaryLocale.regionCode,
        //     "primaryLocale.languageCode": primaryLocale.languageCode,
        //     "primaryLocale.languageTag": primaryLocale.languageTag,
        //     "primaryLocale.currencyCode": primaryLocale.currencyCode,
        //     finalDetectedCountryCode: detectedCountryCode,
        //     detectedCountry: detectedCountry?.name,
        //     detectedLanguage: detectedLanguage?.name,
        //     allLocales: locales.map((l) => l.languageTag),
        // });

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
 * Maps currency code to country code
 */
const getCountryFromCurrency = (currencyCode: string): string | null => {
    const currencyToCountry: Record<string, string> = {
        USD: "US",
        EUR: "DE", // Default to Germany for EUR
        GBP: "GB",
        INR: "IN",
        JPY: "JP",
        CNY: "CN",
        KRW: "KR",
        CAD: "CA",
        AUD: "AU",
        MXN: "MX",
        BRL: "BR",
        RUB: "RU",
    };

    return currencyToCountry[currencyCode] || null;
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
