import React from "react";
import { View, StyleSheet } from "react-native";
import ShareButton from "./ShareButton";
import BookmarkButton from "@/features/bookmarks/components/BookmarkButton";
import { NewsItem } from "@/features/news/types";
import LikeButton from "@/features/likes/components/LikeButton";
import { Spacing, BorderRadius } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";

interface ActionBarProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
    onShare: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ news, isBookmarked, isLiked, onShare }) => {
    const colors = useThemeColors();

    return (
        <View
            style={[
                styles.actionBar,
                {
                    backgroundColor: colors.backgroundColors.primary,
                    borderTopColor: colors.borderColors.light,
                },
            ]}
        >
            <View style={styles.actionGroup}>
                <LikeButton item_hash={news.item_hash} isLiked={isLiked} />
            </View>

            <View style={styles.actionGroup}>
                <BookmarkButton news={news} isBookmarked={isBookmarked} />
            </View>

            <View style={styles.actionGroup}>
                <ShareButton onPress={onShare} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    actionBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderTopWidth: 1,
    },
    actionGroup: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.md,
        minHeight: 44,
    },
});

export default ActionBar;
