import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";

interface ImageSectionProps {
    image: string;
    sourceName?: string;
    timeLabel?: string;
    categories?: string[];
}

const ImageSection: React.FC<ImageSectionProps> = ({ image, sourceName, timeLabel, categories }) => (
    <View style={styles.imageContainer}>
        {/* Background blurred image */}
        <Image source={{ uri: image }} style={styles.backgroundImage} resizeMode="cover" blurRadius={25} />
        <View style={styles.backgroundOverlay} />

        {/* Foreground image */}
        <Image source={{ uri: image }} style={styles.foregroundImage} resizeMode="contain" />

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
        backgroundColor: Colors.background.opaque,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        marginRight: Spacing.xs,
        marginBottom: Spacing.xs,
        ...Shadows.sm,
    },
    categoryText: {
        ...Typography.captionText.small,
        color: Colors.white,
        fontWeight: "600",
        fontSize: 11,
    },
    timeChip: {
        backgroundColor: Colors.background.opaque,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    timeText: {
        ...Typography.captionText.medium,
        color: Colors.white,
        fontWeight: "600",
    },
    sourceChip: {
        backgroundColor: Colors.background.opaque,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    sourceText: {
        ...Typography.captionText.medium,
        color: Colors.white,
        fontWeight: "600",
    },
});

export default ImageSection;
