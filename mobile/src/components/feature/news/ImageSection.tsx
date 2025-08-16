import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Spacing, BorderRadius, Shadows, Typography } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";

interface ImageSectionProps {
    image: string;
    timeLabel?: string;
    categories?: string[];
}

const ImageSection: React.FC<ImageSectionProps> = ({ image, timeLabel, categories }) => {
    const colors = useThemeColors();

    const styles = StyleSheet.create({
        imageContainer: {
            width: "100%",
            height: "100%",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            overflow: "hidden",
            borderTopLeftRadius: BorderRadius.sm,
            borderTopRightRadius: BorderRadius.sm,
        },
        backgroundImage: {
            ...StyleSheet.absoluteFillObject,
            width: "100%",
            height: "100%",
        },
        backgroundOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.3)",
        },
        foregroundImage: {
            width: "100%",
            height: "100%",
        },
        overlayContainer: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: Spacing.md,
        },
        leftContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
            flex: 1,
            flexWrap: "wrap",
        },
        rightContainer: {
            alignItems: "flex-end",
        },
        categoryChip: {
            backgroundColor: colors.surface.overlay,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 4,
            borderRadius: BorderRadius.sm,
            marginRight: Spacing.xs,
            marginBottom: Spacing.xs,
            ...Shadows.sm,
        },
        categoryText: {
            ...Typography.captionText.small,
            color: colors.white,
            fontWeight: "600",
            fontSize: 11,
        },
        timeChip: {
            backgroundColor: colors.surface.overlay,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 4,
            borderRadius: BorderRadius.sm,
            ...Shadows.sm,
        },
        timeText: {
            ...Typography.captionText.small,
            color: colors.white,
            fontWeight: "600",
            fontSize: 11,
        },
    });

    return (
        <View style={styles.imageContainer}>
            {/* Background blurred image */}
            <Image source={{ uri: image }} style={styles.backgroundImage} contentFit="cover" blurRadius={25} />

            {/* Background overlay */}
            <View style={styles.backgroundOverlay} />

            {/* Foreground sharp image */}
            <Image source={{ uri: image }} style={styles.foregroundImage} contentFit="contain" />

            {/* Top overlay with categories on left and time on right */}
            <View style={styles.overlayContainer}>
                {/* Left side - Categories */}
                <View style={styles.leftContainer}>
                    {categories &&
                        categories.slice(0, 3).map((category, index) => (
                            <View key={index} style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </View>
                        ))}
                </View>

                {/* Right side - Time */}
                <View style={styles.rightContainer}>
                    {timeLabel && (
                        <View style={styles.timeChip}>
                            <Text style={styles.timeText}>{timeLabel}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default ImageSection;
