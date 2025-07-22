import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/constants/Fonts";
import { Spacing, Shadows } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import useColorScheme from "@/hooks/useColorScheme.web";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppHeader: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const colorScheme = useColorScheme();

    const statusBarStyle = colorScheme === "dark" ? "light-content" : "dark-content";
    const statusBarBg = colors.backgroundColors.primary;

    const handleMenuPress = () => {
        // TODO: Implement menu functionality
        console.log("Menu pressed");
    };

    const handleSettingsPress = () => {
        // TODO: Implement settings functionality
        console.log("Settings pressed");
    };

    return (
        <>
            <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarBg} />
            <View
                style={[
                    styles.headerContainer,
                    {
                        paddingTop: insets.top,
                        backgroundColor: colors.backgroundColors.primary,
                        borderBottomColor: colors.borderColors.light,
                        shadowColor: colors.black,
                    },
                ]}
            >
                <View style={styles.headerContent}>
                    {/* Left side - Hamburger Menu */}
                    <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
                        <Ionicons name="menu" size={24} color={colors.textColors.primary} />
                    </TouchableOpacity>

                    {/* Center - Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={[styles.logoText, { color: colors.accent.redditRed }]}>
                            <Text style={[styles.logoBold, { color: colors.accent.redditRed }]}>Snap</Text>
                            <Text style={[styles.logoLight, { color: colors.accent.redditRed }]}>News</Text>
                        </Text>
                    </View>

                    {/* Right side - Settings */}
                    <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress} activeOpacity={0.7}>
                        <Ionicons name="settings-outline" size={24} color={colors.textColors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Bottom border for separation */}
                <View style={[styles.bottomBorder, { backgroundColor: colors.borderColors.light }]} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: Spacing.sm,
        ...Shadows.md,
        elevation: 4,
        borderBottomWidth: 1,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.xs,
        paddingTop: Spacing.sm,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-start",
    },
    logoText: {
        ...Typography.heading.h2,
        letterSpacing: -0.5,
    },
    logoBold: {
        ...Typography.heading.h2,
        fontFamily: Typography.heading.h1.fontFamily,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    logoLight: {
        ...Typography.heading.h2,
        fontFamily: Typography.bodyText.medium.fontFamily,
        fontWeight: "300",
        opacity: 0.95,
        letterSpacing: 0.5,
    },
    bottomBorder: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        opacity: 0.5,
    },
});

export default AppHeader;
