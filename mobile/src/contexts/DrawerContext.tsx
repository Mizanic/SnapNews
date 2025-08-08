import React from "react";

interface DrawerContextValue {
    isOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const openDrawer = React.useCallback(() => setIsOpen(true), []);
    const closeDrawer = React.useCallback(() => setIsOpen(false), []);
    const toggleDrawer = React.useCallback(() => setIsOpen((prev) => !prev), []);

    const value = React.useMemo(() => ({ isOpen, openDrawer, closeDrawer, toggleDrawer }), [isOpen, openDrawer, closeDrawer, toggleDrawer]);

    return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

export const useDrawer = (): DrawerContextValue => {
    const ctx = React.useContext(DrawerContext);
    if (!ctx) throw new Error("useDrawer must be used within a DrawerProvider");
    return ctx;
};

export default DrawerContext;
