import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Share, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";

interface ShareButtonProps {
    newsSourceUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ newsSourceUrl }) => {
    const colors = useThemeColors();
    const { triggerHaptic } = useHaptics();

    const handleShare = async () => {
        try {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            const result = await Share.share({
                message: `Check out this news article: ${newsSourceUrl}`,
                url: newsSourceUrl,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert("Error", "Unable to share this article");
        }
    };

    return (
        <TouchableOpacity
            onPress={handleShare}
            style={[
                styles.button,
                {
                    backgroundColor: colors.backgroundColors.primary,
                    borderColor: colors.borderColors.medium,
                    shadowColor: colors.black,
                },
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.buttonContent}>
                <Ionicons name="share-social-outline" size={18} color={colors.gray[600]} style={{ marginRight: Spacing.xs }} />
                <Text style={[styles.buttonText, { color: colors.textColors.secondary }]}>Share</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        minWidth: 80,
        ...Shadows.sm,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        ...Typography.button.small,
        fontWeight: "600",
    },
});

export default ShareButton;
