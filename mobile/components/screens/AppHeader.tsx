import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/constants/Fonts";
import { Spacing, Shadows } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppHeader: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary[600]} />
            <LinearGradient
                colors={[colors.primary[500], colors.primary[600], colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerContainer, { paddingTop: insets.top }]}
            >
                <View style={styles.headerContent}>
                    <View style={styles.logoContainer}>
                        <View style={[styles.logoIconContainer, { backgroundColor: colors.white }]}>
                            <Text style={styles.logoIcon}>📰</Text>
                        </View>
                        <View style={styles.logoTextContainer}>
                            <Text style={[styles.logoText, { color: colors.white }]}>
                                <Text style={[styles.logoBold, { color: colors.white }]}>Snap</Text>
                                <Text style={[styles.logoLight, { color: colors.white }]}>News</Text>
                            </Text>
                            <Text style={[styles.taglineText, { color: colors.white }]}>Stay Informed, Stay Ahead</Text>
                        </View>
                    </View>

                    <View style={styles.headerActions}>
                        <View style={[styles.statusIndicator, { backgroundColor: colors.accent.red }]}>
                            <View style={[styles.liveIndicator, { backgroundColor: colors.white }]} />
                            <Text style={[styles.liveText, { color: colors.white }]}>LIVE</Text>
                        </View>
                    </View>
                </View>

                {/* Subtle bottom border */}
                <View style={[styles.bottomBorder, { backgroundColor: colors.white }]} />
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: Spacing.md,
        ...Shadows.md,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    logoIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Spacing.md,
        ...Shadows.sm,
    },
    logoIcon: {
        fontSize: 24,
    },
    logoTextContainer: {
        flex: 1,
    },
    logoText: {
        ...Typography.heading.h2,
        marginBottom: 2,
    },
    logoBold: {
        ...Typography.heading.h2,
        fontFamily: Typography.heading.h1.fontFamily,
    },
    logoLight: {
        ...Typography.heading.h2,
        fontFamily: Typography.bodyText.medium.fontFamily,
        opacity: 0.95,
    },
    taglineText: {
        ...Typography.captionText.large,
        opacity: 0.85,
        fontStyle: "italic",
    },
    headerActions: {
        alignItems: "flex-end",
    },
    statusIndicator: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        ...Shadows.sm,
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    liveText: {
        ...Typography.label.small,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    bottomBorder: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        opacity: 0.1,
    },
});

export default AppHeader;
