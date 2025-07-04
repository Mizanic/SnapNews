import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import useColorScheme from "@/hooks/useColorScheme.web";
import AppHeader from "@/components/screens/AppHeader";
import { Provider } from "react-redux";
import store, { persistor } from "@/dux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Colors } from "@/constants/Theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <StatusBar style="light" backgroundColor={Colors.primary[600]} />
                    <AppHeader />
                    <Navigation />
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}
