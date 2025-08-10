import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing, BorderRadius, Shadows, Typography } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";

interface ShareButtonProps {
    onPress: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onPress }) => {
    const colors = useThemeColors();
    const { triggerHaptic } = useHaptics();

    const handlePress = () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
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

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[
                styles.button,
                {
                    backgroundColor: colors.surface.base,
                    borderColor: colors.border.default,
                    shadowColor: colors.black,
                },
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.buttonContent}>
                <Ionicons name="share-social-outline" size={18} color={colors.content.secondary} style={{ marginRight: Spacing.xs }} />
                <Text style={[styles.buttonText, { color: colors.content.secondary }]}>Share</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ShareButton;
