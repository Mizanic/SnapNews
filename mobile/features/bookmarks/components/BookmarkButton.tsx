import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NewsItem } from "@/features/news/types";
import { Spacing, BorderRadius, Shadows, Typography } from "@/styles/theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useBookmarkAction } from "@/features/news/hooks/useBookmarkAction";

interface BookmarkButtonProps {
    news: NewsItem;
    isBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ news, isBookmarked }) => {
    const colors = useThemeColors();
    const { handleBookmarkPress } = useBookmarkAction(news, isBookmarked);

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
            onPress={handleBookmarkPress}
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

export default BookmarkButton;
