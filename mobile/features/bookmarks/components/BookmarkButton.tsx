import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addBookmark, removeBookmark } from "@/features/bookmarks/state/bookmarksStore";
import { useDispatch } from "react-redux";
import { NewsItem } from "@/features/news/types";
import { Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useHaptics } from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";

interface BookmarkButtonProps {
    news: NewsItem;
    isBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ news, isBookmarked }) => {
    const dispatch = useDispatch();
    const colors = useThemeColors();
    const { triggerHaptic } = useHaptics();

    const toggleBookmark = () => {
        if (!isBookmarked) {
            dispatch(addBookmark(news));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            dispatch(removeBookmark(news.item_hash));
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return (
        <TouchableOpacity
            onPress={toggleBookmark}
            style={[
                styles.button,
                {
                    backgroundColor: colors.backgroundColors.primary,
                    borderColor: colors.borderColors.medium,
                    shadowColor: colors.black,
                },
                isBookmarked && {
                    backgroundColor: colors.accent.orange,
                    borderColor: colors.accent.orange,
                    ...Shadows.md,
                },
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.buttonContent}>
                <Ionicons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={18}
                    color={isBookmarked ? colors.white : colors.gray[600]}
                    style={{ marginRight: Spacing.xs }}
                />
                <Text style={[styles.buttonText, { color: colors.textColors.secondary }, isBookmarked && { color: colors.white }]}>
                    {isBookmarked ? "Saved" : "Save"}
                </Text>
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

export default BookmarkButton;
