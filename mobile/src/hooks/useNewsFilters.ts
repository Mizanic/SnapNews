import React from "react";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { NewsItem } from "@/lib/types/newsTypes";

export type TimeFilter = "today" | "48h" | "96h" | "7d";

export interface UseNewsFiltersReturn {
    // Category filtering
    selectedCategories: Set<string>;
    setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
    handleCategoryToggle: (category: string) => void;
    handleClearAllCategories: () => void;
    handleSelectAllCategories: () => void;

    // Time filtering
    selectedTimeFilter: TimeFilter;
    setSelectedTimeFilter: React.Dispatch<React.SetStateAction<TimeFilter>>;
    handleTimeFilterSelect: (filter: TimeFilter) => void;

    // Filter function
    filterNews: (newsData: NewsItem[]) => NewsItem[];

    // Filter states
    hasActiveFilters: boolean;
    hasActiveTimeFilter: boolean;
}

export const useNewsFilters = (initialCategories?: Set<string>, initialTimeFilter?: TimeFilter): UseNewsFiltersReturn => {
    const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(initialCategories || new Set(SUPPORTED_CATEGORIES));
    const [selectedTimeFilter, setSelectedTimeFilter] = React.useState<TimeFilter>(initialTimeFilter || "today");

    // Get cutoff time for filtering (memoized to prevent infinite loops)
    const cutoffTime = React.useMemo(() => {
        if (selectedTimeFilter === "today") {
            return null; // Don't filter for "today" - show all news
        }

        const now = new Date();
        const cutoff = new Date();

        switch (selectedTimeFilter) {
            case "48h":
                cutoff.setTime(now.getTime() - 48 * 60 * 60 * 1000);
                break;
            case "96h":
                cutoff.setTime(now.getTime() - 96 * 60 * 60 * 1000);
                break;
            case "7d":
                cutoff.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            default:
                return null;
        }

        return cutoff;
    }, [selectedTimeFilter]);

    // Category handlers
    const handleCategoryToggle = React.useCallback((category: string) => {
        setSelectedCategories((prev) => {
            const newCategories = new Set(prev);
            if (newCategories.has(category)) {
                newCategories.delete(category);
            } else {
                newCategories.add(category);
            }
            return newCategories;
        });
    }, []);

    const handleClearAllCategories = React.useCallback(() => {
        setSelectedCategories(new Set());
    }, []);

    const handleSelectAllCategories = React.useCallback(() => {
        setSelectedCategories(new Set(SUPPORTED_CATEGORIES));
    }, []);

    // Time filter handlers
    const handleTimeFilterSelect = React.useCallback((filter: TimeFilter) => {
        setSelectedTimeFilter(filter);
    }, []);

    // Filter function
    const filterNews = React.useCallback(
        (newsData: NewsItem[]): NewsItem[] => {
            if (!newsData.length) return [];

            let filtered = [...newsData]; // Create a copy to avoid mutations

            // Filter by categories (if not all categories are selected)
            if (selectedCategories.size > 0 && selectedCategories.size < SUPPORTED_CATEGORIES.length) {
                filtered = filtered.filter((news: NewsItem) => {
                    // Check if any of the news categories match selected categories
                    return news.categories.some((category) => selectedCategories.has(category.toUpperCase()));
                });
            }

            // Filter by time only if we have a valid cutoffTime
            if (cutoffTime) {
                filtered = filtered.filter((news: NewsItem) => {
                    try {
                        const publishedTime = new Date(news.published);
                        return !isNaN(publishedTime.getTime()) && publishedTime >= cutoffTime;
                    } catch (error) {
                        // If date parsing fails, include the news item
                        return true;
                    }
                });
            }

            return filtered;
        },
        [selectedCategories, cutoffTime]
    );

    // Computed states
    const hasActiveFilters = selectedCategories.size > 0 && selectedCategories.size < SUPPORTED_CATEGORIES.length;
    const hasActiveTimeFilter = selectedTimeFilter !== "today";

    return {
        // Category filtering
        selectedCategories,
        setSelectedCategories,
        handleCategoryToggle,
        handleClearAllCategories,
        handleSelectAllCategories,

        // Time filtering
        selectedTimeFilter,
        setSelectedTimeFilter,
        handleTimeFilterSelect,

        // Filter function
        filterNews,

        // Filter states
        hasActiveFilters,
        hasActiveTimeFilter,
    };
};
