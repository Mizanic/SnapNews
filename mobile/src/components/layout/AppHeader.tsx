import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Spacing, Shadows } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const AppHeader: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const { colorScheme } = useTheme();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const statusBarStyle = colorScheme === "dark" ? "light-content" : "dark-content";
    const statusBarBg = colors.surface.base;

    const handleMenuPress = () => {
        navigation.openDrawer();
    };

    const handleSettingsPress = () => {
        router.push("/settings");
    };

    const handleNotificationPress = () => {
        // TODO: Implement notification functionality
        console.log("Notification pressed");
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
        rightIconsContainer: {
            flexDirection: "row",
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

    return (
        <>
            <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarBg} />
            <View
                style={[
                    styles.headerContainer,
                    {
                        paddingTop: insets.top,
                        backgroundColor: colors.surface.base,
                        borderBottomColor: colors.border.subtle,
                        shadowColor: colors.black,
                    },
                ]}
            >
                <View style={styles.headerContent}>
                    {/* Left side - Hamburger Menu */}
                    <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
                        <Ionicons name="menu" size={24} color={colors.content.primary} />
                    </TouchableOpacity>

                    {/* Center - Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={[styles.logoText, { color: colors.accent.redditRed }]}>
                            <Text style={[styles.logoBold, { color: colors.accent.redditRed }]}>Snap</Text>
                            <Text style={[styles.logoLight, { color: colors.accent.redditRed }]}>News</Text>
                        </Text>
                    </View>

                    {/* Right side - Icons */}
                    <View style={styles.rightIconsContainer}>
                        <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={24} color={colors.content.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress} activeOpacity={0.7}>
                            <Ionicons name="settings-outline" size={24} color={colors.content.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom border for separation */}
                <View style={[styles.bottomBorder, { backgroundColor: colors.border.subtle }]} />
            </View>
        </>
    );
};

export default AppHeader;
