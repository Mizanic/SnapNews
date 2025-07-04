import React from "react";
import { View, StyleSheet } from "react-native";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import { NewsItem } from "@/model/newsItem";
import LikeButton from "./LikeButton";
import { Colors, Spacing, BorderRadius } from "@/constants/Theme";

interface ActionBarProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ news, isBookmarked, isLiked }) => {
    return (
        <View style={styles.actionBar}>
            <View style={styles.actionGroup}>
                <LikeButton item_hash={news.item_hash} isLiked={isLiked} />
            </View>

            <View style={styles.actionGroup}>
                <BookmarkButton news={news} isBookmarked={isBookmarked} />
            </View>

            <View style={styles.actionGroup}>
                <ShareButton newsSourceUrl={news.news_url} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    actionBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        backgroundColor: Colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
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
