import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";

interface ImageSectionProps {
    image: string;
    sourceName?: string;
    timeLabel?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ image, sourceName, timeLabel }) => (
    <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

        {/* Top overlay with both time and source labels */}
        {(timeLabel || sourceName) && (
            <View style={styles.overlayContainer}>
                {timeLabel && (
                    <View style={styles.timeChip}>
                        <Text style={styles.timeText}>{timeLabel}</Text>
                    </View>
                )}
                {sourceName && (
                    <View style={styles.sourceChip}>
                        <Text style={styles.sourceText}>{sourceName}</Text>
                    </View>
                )}
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        aspectRatio: 16 / 9,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: BorderRadius.sm,
        borderTopRightRadius: BorderRadius.sm,
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
