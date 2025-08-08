import React from "react";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { useFilterContext } from "@/contexts/FilterContext";
import { NewsItem } from "@/lib/types/newsTypes";
import { TimeFilter } from "@/lib/types/timeFilter";

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

// Create a stable default categories set to prevent re-renders
const DEFAULT_CATEGORIES = new Set(SUPPORTED_CATEGORIES);

// Create a factory for new full categories set
const createFullCategoriesSet = () => new Set(SUPPORTED_CATEGORIES);

export const useNewsFilters = (
    newsData: NewsItem[],
    initialTimeFilter: TimeFilter = "today",
    initialCategories?: Set<string>
): UseNewsFiltersReturn => {
    // Prefer global context if available; fallback to local init
    const filterCtx = (() => {
        try {
            return useFilterContext();
        } catch {
            return undefined;
        }
    })();

    const [localSelectedCategories, setLocalSelectedCategories] = React.useState<Set<string>>(initialCategories || DEFAULT_CATEGORIES);
    const [localSelectedTimeFilter, setLocalSelectedTimeFilter] = React.useState<TimeFilter>(initialTimeFilter);

    const selectedCategories = filterCtx?.selectedCategories ?? localSelectedCategories;
    const setSelectedCategories = filterCtx?.setSelectedCategories ?? setLocalSelectedCategories;
    // Keep time filter LOCAL to the screen to avoid cross-tab conflicts (e.g., Hot should default to "today")
    const selectedTimeFilter = localSelectedTimeFilter;
    const setSelectedTimeFilter = setLocalSelectedTimeFilter;
    const [filterModalVisible, setFilterModalVisible] = React.useState(false);
    const [sortModalVisible, setSortModalVisible] = React.useState(false);

    // Keep selected categories in sync when initialCategories changes (e.g., from navigation params)
    React.useEffect(() => {
        if (initialCategories) {
            setSelectedCategories(new Set(initialCategories));
        }
    }, [initialCategories]);

    // Keep time filter in sync if initialTimeFilter changes (from navigation params)
    React.useEffect(() => {
        if (initialTimeFilter) {
            setSelectedTimeFilter(initialTimeFilter);
        }
    }, [initialTimeFilter]);

    // Memoized cutoff time to prevent infinite re-renders
    const cutoffTime = React.useMemo(() => {
        if (selectedTimeFilter === "all") return null;

        const now = new Date();
        const cutoff = new Date();

        switch (selectedTimeFilter) {
            case "today":
                cutoff.setTime(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "48h":
                cutoff.setTime(now.getTime() - 48 * 60 * 60 * 1000);
                break;
            case "96h":
                cutoff.setTime(now.getTime() - 96 * 60 * 60 * 1000);
                break;
            case "7d":
                cutoff.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "14d":
                cutoff.setTime(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                break;
            default:
                return null;
        }
        return cutoff;
    }, [selectedTimeFilter]);

    // Filter the news data
    const filteredNewsData = React.useMemo(() => {
        if (!newsData.length) {
            return [];
        }

        let filtered = [...newsData]; // Create copy to avoid mutations

        // Filter by categories (if not all categories are selected)
        if (selectedCategories.size > 0 && selectedCategories.size < SUPPORTED_CATEGORIES.length) {
            const beforeLength = filtered.length;
            filtered = filtered.filter((news) => {
                const hasMatchingCategory = news.categories.some((category) => selectedCategories.has(category.toUpperCase()));
                return hasMatchingCategory;
            });
        } else {
        }

        // Filter by time if cutoff time exists
        if (cutoffTime) {
            const beforeLength = filtered.length;
            filtered = filtered.filter((news) => {
                try {
                    const publishedTime = new Date(news.published);
                    return !isNaN(publishedTime.getTime()) && publishedTime >= cutoffTime;
                } catch {
                    // If date parsing fails, include the news item
                    return true;
                }
            });
        } else {
        }

        return filtered;
    }, [newsData, selectedCategories, cutoffTime]);

    // Category actions
    const toggleCategory = React.useCallback(
        (category: string) => {
            const next = new Set<string>(selectedCategories);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            setSelectedCategories(next);
        },
        [selectedCategories, setSelectedCategories]
    );

    const clearAllCategories = React.useCallback(() => {
        setSelectedCategories(new Set<string>());
    }, [setSelectedCategories]);

    const selectAllCategories = React.useCallback(() => {
        setSelectedCategories(createFullCategoriesSet());
    }, [setSelectedCategories]);

    // Modal actions
    const openFilterModal = React.useCallback(() => setFilterModalVisible(true), []);
    const closeFilterModal = React.useCallback(() => setFilterModalVisible(false), []);
    const openSortModal = React.useCallback(() => setSortModalVisible(true), []);
    const closeSortModal = React.useCallback(() => setSortModalVisible(false), []);

    // Computed states (memoized to prevent unnecessary re-renders)
    const hasActiveFilters = React.useMemo(
        () => selectedCategories.size > 0 && selectedCategories.size < SUPPORTED_CATEGORIES.length,
        [selectedCategories.size]
    );
    const hasActiveSort = React.useMemo(() => selectedTimeFilter !== "all", [selectedTimeFilter]);

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
