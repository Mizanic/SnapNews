// Centralized list of supported categories derived from NewsSources.json
// Keeping keys in uppercase to match backend/news item categories

export const SUPPORTED_CATEGORIES: string[] = ["INDIA", "TECH", "WORLD", "SPORTS", "BUSINESS", "CRICKET", "HEALTH", "TOP"];

// Category metadata consolidated here to avoid duplication across UI components
export const CATEGORY_ICONS: Record<string, string> = {
    ALL: "globe-outline",
    INDIA: "location-outline",
    TECH: "laptop-outline",
    WORLD: "earth-outline",
    SPORTS: "football-outline",
    BUSINESS: "business-outline",
    CRICKET: "baseball-outline",
    HEALTH: "medical-outline",
    TOP: "trending-up-outline",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    ALL: "All news from all sources",
    INDIA: "News from India",
    TECH: "Technology and innovation",
    WORLD: "International news",
    SPORTS: "Sports news and updates",
    BUSINESS: "Business and finance",
    CRICKET: "Cricket news and scores",
    HEALTH: "Health and wellness",
    TOP: "Top trending stories",
};

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    ALL: "All Categories",
    INDIA: "India",
    TECH: "Tech",
    WORLD: "World",
    SPORTS: "Sports",
    BUSINESS: "Business",
    CRICKET: "Cricket",
    HEALTH: "Health",
    TOP: "Top",
};

export const getCategoryIcon = (category: string): any => CATEGORY_ICONS[category] || "newspaper-outline";

export const getCategoryDisplayName = (category: string): string =>
    CATEGORY_DISPLAY_NAMES[category] || (category ? category.charAt(0) + category.slice(1).toLowerCase() : "");

export const getCategoryDescription = (category: string): string => CATEGORY_DESCRIPTIONS[category] || "News category";
