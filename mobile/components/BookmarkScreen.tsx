import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import NewsCard from "./screens/NewsCard";
import { Spacing } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Typography } from "@/constants/Fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BookmarkScreen: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const bookmarkedNews = Object.values(bookmarks);

    const renderEmptyState = () => (
        <View style={[styles.emptyContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
            <Text style={[styles.emptyTitle, { color: colors.textColors.primary }]}>No Bookmarks Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textColors.secondary }]}>
                Bookmark articles you want to read later by tapping the save button on any news card.
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            {bookmarkedNews.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={bookmarkedNews}
                    renderItem={({ item }) => (
                        <NewsCard news={item as any} isBookmarked={true} isLiked={likes.hasOwnProperty((item as any).item_hash)} />
                    )}
                    contentContainerStyle={[styles.listContainer, { backgroundColor: colors.backgroundColors.secondary }]}
                    keyExtractor={(item) => (item as any).item_hash}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.xl,
    },
    emptyTitle: {
        ...Typography.heading.h2,
        marginBottom: Spacing.md,
        textAlign: "center",
    },
    emptySubtitle: {
        ...Typography.bodyText.medium,
        textAlign: "center",
        lineHeight: 24,
    },
    listContainer: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    separator: {
        height: Spacing.xs,
    },
});

export default BookmarkScreen;
