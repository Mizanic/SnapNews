import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { DrawerProvider } from "@/contexts/DrawerContext";
import { FilterProvider } from "@/contexts/FilterContext";
import SideDrawer from "@/components/layout/SideDrawer";

import { Provider } from "react-redux";
import store, { persistor } from "@/lib/state/store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { sharedQueryClient } from "@/lib/sharedQueryClient";

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { colorScheme } = useTheme();

    return (
        <SafeAreaProvider>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <DrawerProvider>
                <FilterProvider>
                    <SideDrawer />
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen
                            name="settings"
                            options={{
                                headerShown: true,
                                presentation: "modal",
                            }}
                        />
                    </Stack>
                </FilterProvider>
            </DrawerProvider>
        </SafeAreaProvider>
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
