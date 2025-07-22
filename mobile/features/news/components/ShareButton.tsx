import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";

interface ShareButtonProps {
    newsSourceUrl: string;
    viewShotRef: React.RefObject<ViewShot>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ newsSourceUrl, viewShotRef }) => {
    const colors = useThemeColors();
    const { triggerHaptic } = useHaptics();

    const handleShare = async () => {
        try {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

            // The capture options are now in NewsCard.tsx, so we call capture() without arguments.
            const uri = await viewShotRef.current?.capture?.();

            if (uri) {
                const shareOptions = {
                    title: "Check out this news article",
                    message: `Check out this news article: ${newsSourceUrl}`,
                    url: uri, // The result from capture() is already a data-uri
                };
                await Share.open(shareOptions);
            }
        } catch (error) {
            // When the user cancels the share dialog, react-native-share throws an error.
            // We check if the error message indicates a user cancellation to avoid showing an unnecessary alert.
            if (!(error instanceof Error && error.message.includes("User did not share"))) {
                Alert.alert("Error", "Unable to share this article");
            }
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
