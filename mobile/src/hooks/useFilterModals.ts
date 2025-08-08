import React from "react";

export interface UseFilterModalsReturn {
    filterModalVisible: boolean;
    sortModalVisible: boolean;
    openFilterModal: () => void;
    closeFilterModal: () => void;
    openSortModal: () => void;
    closeSortModal: () => void;
    closeAllModals: () => void;
}

export const useFilterModals = (): UseFilterModalsReturn => {
    const [filterModalVisible, setFilterModalVisible] = React.useState(false);
    const [sortModalVisible, setSortModalVisible] = React.useState(false);

    const openFilterModal = React.useCallback(() => {
        setFilterModalVisible(true);
    }, []);

    const closeFilterModal = React.useCallback(() => {
        setFilterModalVisible(false);
    }, []);

    const openSortModal = React.useCallback(() => {
        setSortModalVisible(true);
    }, []);

    const closeSortModal = React.useCallback(() => {
        setSortModalVisible(false);
    }, []);

    const closeAllModals = React.useCallback(() => {
        setFilterModalVisible(false);
        setSortModalVisible(false);
    }, []);

    return {
        filterModalVisible,
        sortModalVisible,
        openFilterModal,
        closeFilterModal,
        openSortModal,
        closeSortModal,
        closeAllModals,
    };
};
