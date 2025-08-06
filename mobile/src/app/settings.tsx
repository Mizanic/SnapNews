import React from "react";
import { Stack, useRouter } from "expo-router";
import SettingsScreen from "@/screen/settings/SettingsScreen";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { Spacing } from "@/styles";

export default function Settings() {
    const router = useRouter();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useTheme();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.backgroundColors.primary} />
            <View style={{ flex: 1, backgroundColor: colors.backgroundColors.primary }}>
                {/* Custom Header */}
                <View
                    style={{
                        paddingTop: insets.top,
                        paddingHorizontal: Spacing.md,
                        paddingBottom: Spacing.md,
                        backgroundColor: colors.backgroundColors.primary,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.borderColors.light,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: Spacing.md }} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color={colors.textColors.primary} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: colors.textColors.primary,
                            flex: 1,
                        }}
                    >
                        Settings
                    </Text>
                </View>

                {/* Settings Content */}
                <SettingsScreen />
            </View>
        </>
    );
}
