import React, { useContext, useState, useCallback, useMemo } from "react";
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

export const FilterContext = React.createContext<FilterContextValue | undefined>(undefined);

const createFullCategoriesSet = () => new Set(SUPPORTED_CATEGORIES);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCategories, setSelectedCategoriesState] = useState<Set<string>>(createFullCategoriesSet());
    const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>("all");

    const setSelectedCategories = useCallback((next: Set<string>) => {
        setSelectedCategoriesState(new Set(next));
    }, []);

    const clearAllCategories = useCallback(() => setSelectedCategoriesState(new Set()), []);
    const selectAllCategories = useCallback(() => setSelectedCategoriesState(createFullCategoriesSet()), []);

    const value = useMemo(
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
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error("useFilterContext must be used within a FilterProvider");
    return ctx;
};
