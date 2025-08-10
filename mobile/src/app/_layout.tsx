import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FilterProvider } from "@/contexts/FilterContext";
import AppDrawerContent from "../components/layout/AppDrawerContent";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

import { Provider } from "react-redux";
import store, { persistor } from "@/lib/state/store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { sharedQueryClient } from "@/lib/sharedQueryClient";
import { Spacing } from "@/styles";

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { colorScheme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <FilterProvider>
                    <Drawer
                        screenOptions={{
                            drawerType: "front",
                            swipeEdgeWidth: 32,
                            swipeEnabled: true,
                            drawerStyle: { width: "61.8%" },
                        }}
                        drawerContent={(props: DrawerContentComponentProps) => <AppDrawerContent {...props} />}
                    >
                        <Drawer.Screen name="(tabs)" options={{ headerShown: false, title: "Home" }} />
                        <Drawer.Screen name="settings" options={{ drawerItemStyle: { display: "none" } }} />
                    </Drawer>
                </FilterProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={sharedQueryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider>
                        <AppContent />
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    );
}
