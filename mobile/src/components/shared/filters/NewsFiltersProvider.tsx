import React from "react";
import { NewsItem } from "@/lib/types/newsTypes";
import { useNewsFilters, UseNewsFiltersReturn, TimeFilter } from "@/hooks/useNewsFilters";
import { useFilterModals, UseFilterModalsReturn } from "@/hooks/useFilterModals";
import FilterModal from "./FilterModal";
import SortModal from "./SortModal";
import NewsScreenHeader from "./NewsScreenHeader";

interface NewsFiltersProviderProps {
    children?: React.ReactNode;
    title: string;
    newsData: NewsItem[];
    initialCategories?: Set<string>;
    initialTimeFilter?: TimeFilter;
    onFiltersChange?: (filteredData: NewsItem[]) => void;
}

export interface NewsFiltersContextValue extends UseNewsFiltersReturn, UseFilterModalsReturn {
    filteredNewsData: NewsItem[];
}

const NewsFiltersContext = React.createContext<NewsFiltersContextValue | null>(null);

export const useNewsFiltersContext = () => {
    const context = React.useContext(NewsFiltersContext);
    if (!context) {
        throw new Error("useNewsFiltersContext must be used within NewsFiltersProvider");
    }
    return context;
};

const NewsFiltersProvider: React.FC<NewsFiltersProviderProps> = ({
    children,
    title,
    newsData,
    initialCategories,
    initialTimeFilter,
    onFiltersChange,
}) => {
    const filterHooks = useNewsFilters(initialCategories, initialTimeFilter);
    const modalHooks = useFilterModals();

    // Apply filters to news data
    const filteredNewsData = React.useMemo(() => {
        const filtered = filterHooks.filterNews(newsData);
        onFiltersChange?.(filtered);
        return filtered;
    }, [newsData, filterHooks.filterNews, onFiltersChange]);

    const contextValue: NewsFiltersContextValue = {
        ...filterHooks,
        ...modalHooks,
        filteredNewsData,
    };

    return (
        <NewsFiltersContext.Provider value={contextValue}>
            <NewsScreenHeader
                title={title}
                selectedCategoriesCount={filterHooks.selectedCategories.size}
                selectedTimeFilter={filterHooks.selectedTimeFilter}
                onFilterPress={modalHooks.openFilterModal}
                onSortPress={modalHooks.openSortModal}
            />

            {children}

            <FilterModal
                visible={modalHooks.filterModalVisible}
                onClose={modalHooks.closeFilterModal}
                selectedCategories={filterHooks.selectedCategories}
                onCategoryToggle={filterHooks.handleCategoryToggle}
                onClearAll={filterHooks.handleClearAllCategories}
                onSelectAll={filterHooks.handleSelectAllCategories}
            />

            <SortModal
                visible={modalHooks.sortModalVisible}
                onClose={modalHooks.closeSortModal}
                selectedTimeFilter={filterHooks.selectedTimeFilter}
                onTimeFilterSelect={filterHooks.handleTimeFilterSelect}
            />
        </NewsFiltersContext.Provider>
    );
};

export default NewsFiltersProvider;
