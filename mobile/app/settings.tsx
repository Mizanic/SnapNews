import React from "react";
import { Stack, useRouter } from "expo-router";
import SettingsScreen from "@/features/settings/screens/SettingsScreen";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function Settings() {
    const router = useRouter();
    const colors = useThemeColors();

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerShown: true,
                    presentation: "modal",
                    headerStyle: {
                        backgroundColor: colors.backgroundColors.primary,
                    },
                    headerTitleStyle: {
                        color: colors.textColors.primary,
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={colors.textColors.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <SettingsScreen />
        </>
    );
}
