import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing } from "@/constants/Theme";

const SkeletonElement = ({ style }: { style: any }) => {
    const colors = useThemeColors();
    return <View style={[styles.skeleton, { backgroundColor: colors.backgroundColors.tertiary }, style]} />;
};

const NewsCardSkeleton = () => {
    return (
        <View style={styles.container}>
            <SkeletonElement style={styles.image} />
            <View style={styles.content}>
                <SkeletonElement style={styles.title} />
                <SkeletonElement style={styles.source} />
                <SkeletonElement style={styles.summary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: Spacing.md,
        borderRadius: Spacing.sm,
        overflow: "hidden",
        marginBottom: Spacing.md,
    },
    image: {
        height: 200,
        width: "100%",
        borderRadius: Spacing.sm,
    },
    content: {
        paddingTop: Spacing.md,
    },
    title: {
        height: 20,
        width: "80%",
        marginBottom: Spacing.sm,
    },
    source: {
        height: 16,
        width: "40%",
        marginBottom: Spacing.md,
    },
    summary: {
        height: 60,
        width: "100%",
    },
    skeleton: {
        borderRadius: Spacing.xs,
    },
});

export default NewsCardSkeleton;
