import React from "react";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { NewsItem } from "@/lib/types/newsTypes";

export type TimeFilter = "today" | "48h" | "96h" | "7d";

export interface UseNewsFiltersReturn {
    // Filtered data
    filteredNewsData: NewsItem[];

    // Category state
    selectedCategories: Set<string>;
    toggleCategory: (category: string) => void;
    clearAllCategories: () => void;
    selectAllCategories: () => void;

    // Time filter state
    selectedTimeFilter: TimeFilter;
    setSelectedTimeFilter: (filter: TimeFilter) => void;

    // Modal state
    filterModalVisible: boolean;
    setFilterModalVisible: (visible: boolean) => void;
    sortModalVisible: boolean;
    setSortModalVisible: (visible: boolean) => void;

    // Computed states
    hasActiveFilters: boolean;
    hasActiveSort: boolean;

    // Helper actions
    openFilterModal: () => void;
    closeFilterModal: () => void;
    openSortModal: () => void;
    closeSortModal: () => void;
}

export const useNewsFilters = (newsData: NewsItem[]): UseNewsFiltersReturn => {
    // Local state
    const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(new Set(SUPPORTED_CATEGORIES));
    const [selectedTimeFilter, setSelectedTimeFilter] = React.useState<TimeFilter>("today");
    const [filterModalVisible, setFilterModalVisible] = React.useState(false);
    const [sortModalVisible, setSortModalVisible] = React.useState(false);

    // Memoized cutoff time to prevent infinite re-renders
    const cutoffTime = React.useMemo(() => {
        if (selectedTimeFilter === "today") return null;

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

    // Filter the news data
    const filteredNewsData = React.useMemo(() => {
        if (!newsData.length) return [];

        let filtered = [...newsData]; // Create copy to avoid mutations

        // Filter by categories (if not all categories are selected)
        if (selectedCategories.size > 0 && selectedCategories.size < SUPPORTED_CATEGORIES.length) {
            filtered = filtered.filter((news) => news.categories.some((category) => selectedCategories.has(category.toUpperCase())));
        }

        // Filter by time if cutoff time exists
        if (cutoffTime) {
            filtered = filtered.filter((news) => {
                try {
                    const publishedTime = new Date(news.published);
                    return !isNaN(publishedTime.getTime()) && publishedTime >= cutoffTime;
                } catch {
                    // If date parsing fails, include the news item
                    return true;
                }
            });
        }

        return filtered;
    }, [newsData, selectedCategories, cutoffTime]);

    // Category actions
    const toggleCategory = React.useCallback((category: string) => {
        setSelectedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    }, []);

    const clearAllCategories = React.useCallback(() => {
        setSelectedCategories(new Set());
    }, []);

    const selectAllCategories = React.useCallback(() => {
        setSelectedCategories(new Set(SUPPORTED_CATEGORIES));
    }, []);

    // Modal actions
    const openFilterModal = React.useCallback(() => setFilterModalVisible(true), []);
    const closeFilterModal = React.useCallback(() => setFilterModalVisible(false), []);
    const openSortModal = React.useCallback(() => setSortModalVisible(true), []);
    const closeSortModal = React.useCallback(() => setSortModalVisible(false), []);

    // Computed states
    const hasActiveFilters = selectedCategories.size > 0 && selectedCategories.size < SUPPORTED_CATEGORIES.length;
    const hasActiveSort = selectedTimeFilter !== "today";

    return {
        // Filtered data
        filteredNewsData,

        // Category state
        selectedCategories,
        toggleCategory,
        clearAllCategories,
        selectAllCategories,

        // Time filter state
        selectedTimeFilter,
        setSelectedTimeFilter,

        // Modal state
        filterModalVisible,
        setFilterModalVisible,
        sortModalVisible,
        setSortModalVisible,

        // Computed states
        hasActiveFilters,
        hasActiveSort,

        // Helper actions
        openFilterModal,
        closeFilterModal,
        openSortModal,
        closeSortModal,
    };
};
