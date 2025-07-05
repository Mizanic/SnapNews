import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/constants/Fonts";
import { Colors, Spacing, Shadows } from "@/constants/Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppHeader: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary[600]} />
            <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerContainer, { paddingTop: insets.top }]}
            >
                <View style={styles.headerContent}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIconContainer}>
                            <Text style={styles.logoIcon}>📰</Text>
                        </View>
                        <View style={styles.logoTextContainer}>
                            <Text style={styles.logoText}>
                                <Text style={styles.logoBold}>Snap</Text>
                                <Text style={styles.logoLight}>News</Text>
                            </Text>
                            <Text style={styles.taglineText}>Stay Informed, Stay Ahead</Text>
                        </View>
                    </View>

                    <View style={styles.headerActions}>
                        <View style={styles.statusIndicator}>
                            <View style={styles.liveIndicator} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>
                </View>

                {/* Subtle bottom border */}
                <View style={styles.bottomBorder} />
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
        backgroundColor: Colors.white,
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
        color: Colors.white,
        marginBottom: 2,
    },
    logoBold: {
        ...Typography.heading.h2,
        fontFamily: Typography.heading.h1.fontFamily,
        color: Colors.white,
    },
    logoLight: {
        ...Typography.heading.h2,
        fontFamily: Typography.bodyText.medium.fontFamily,
        color: Colors.white,
        opacity: 0.95,
    },
    taglineText: {
        ...Typography.captionText.large,
        color: Colors.white,
        opacity: 0.85,
        fontStyle: "italic",
    },
    headerActions: {
        alignItems: "flex-end",
    },
    statusIndicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.accent.red,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        ...Shadows.sm,
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.white,
        marginRight: 6,
    },
    liveText: {
        ...Typography.label.small,
        color: Colors.white,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    bottomBorder: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: Colors.white,
        opacity: 0.1,
    },
});

export default AppHeader;
