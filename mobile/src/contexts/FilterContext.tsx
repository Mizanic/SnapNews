import React from "react";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { TimeFilter } from "@/lib/types/timeFilter";

type FilterContextValue = {
    selectedCategories: Set<string>;
    setSelectedCategories: (next: Set<string>) => void;
    clearAllCategories: () => void;
    selectAllCategories: () => void;

    selectedTimeFilter: TimeFilter;
    setSelectedTimeFilter: (filter: TimeFilter) => void;
};

const FilterContext = React.createContext<FilterContextValue | undefined>(undefined);

const createFullCategoriesSet = () => new Set(SUPPORTED_CATEGORIES);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCategories, setSelectedCategoriesState] = React.useState<Set<string>>(createFullCategoriesSet());
    const [selectedTimeFilter, setSelectedTimeFilter] = React.useState<TimeFilter>("all");

    const setSelectedCategories = React.useCallback((next: Set<string>) => {
        setSelectedCategoriesState(new Set(next));
    }, []);

    const clearAllCategories = React.useCallback(() => setSelectedCategoriesState(new Set()), []);
    const selectAllCategories = React.useCallback(() => setSelectedCategoriesState(createFullCategoriesSet()), []);

    const value = React.useMemo(
        () => ({
            selectedCategories,
            setSelectedCategories,
            clearAllCategories,
            selectAllCategories,
            selectedTimeFilter,
            setSelectedTimeFilter,
        }),
        [selectedCategories, setSelectedCategories, clearAllCategories, selectAllCategories, selectedTimeFilter, setSelectedTimeFilter]
    );

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilterContext = (): FilterContextValue => {
    const ctx = React.useContext(FilterContext);
    if (!ctx) throw new Error("useFilterContext must be used within a FilterProvider");
    return ctx;
};
