import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Share, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";

interface ShareButtonProps {
    newsSourceUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ newsSourceUrl }) => {
    const handleShare = async () => {
        try {
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
        <TouchableOpacity onPress={handleShare} style={styles.button} activeOpacity={0.7}>
            <View style={styles.buttonContent}>
                <Ionicons name="share-social-outline" size={18} color={Colors.gray[600]} style={{ marginRight: Spacing.xs }} />
                <Text style={styles.buttonText}>Share</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.background.primary,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border.medium,
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
        color: Colors.text.secondary,
        fontWeight: "600",
    },
});

export default ShareButton;
