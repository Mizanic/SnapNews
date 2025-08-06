import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addLike, removeLike } from "@/features/likes/state/likesStore";
import { useDispatch } from "react-redux";
import { Spacing, BorderRadius, Shadows, Typography } from "@/styles/theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";

interface LikeButtonProps {
    item_hash: string;
    isLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ item_hash, isLiked }) => {
    const dispatch = useDispatch();
    const colors = useThemeColors();
    const { triggerHaptic } = useHaptics();

    const toggleLike = () => {
        if (!isLiked) {
            dispatch(addLike(item_hash));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            dispatch(removeLike(item_hash));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        }
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
            onPress={toggleLike}
            style={[
                styles.button,
                {
                    backgroundColor: colors.backgroundColors.primary,
                    borderColor: colors.borderColors.medium,
                    shadowColor: colors.black,
                },
                isLiked && {
                    backgroundColor: colors.accent.red,
                    borderColor: colors.accent.red,
                    ...Shadows.md,
                },
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.buttonContent}>
                <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={18}
                    color={isLiked ? colors.white : colors.gray[600]}
                    style={{ marginRight: Spacing.xs }}
                />
                <Text style={[styles.buttonText, { color: colors.textColors.secondary }, isLiked && { color: colors.white }]}>
                    {isLiked ? "Liked" : "Like"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default LikeButton;
