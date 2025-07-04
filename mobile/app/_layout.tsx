import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { Provider } from "react-redux";
import store, { persistor } from "../dux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useColorScheme } from "hooks/useColorScheme.web";
import AppHeader from "components/screens/AppHeader";
import Navigation from "components/Navigation";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        "Lora-Regular": require("../assets/fonts/Lora/static/Lora-Regular.ttf"),
        "Lora-Bold": require("../assets/fonts/Lora/static/Lora-Bold.ttf"),
        "Inter-Regular": require("../assets/fonts/Inter/static/Inter_18pt-Regular.ttf"),
        "Inter-Bold": require("../assets/fonts/Inter/static/Inter_18pt-Bold.ttf"),
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
                    <SafeAreaView style={styles.container}>
                        <AppHeader />
                        <Navigation />
                    </SafeAreaView>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
