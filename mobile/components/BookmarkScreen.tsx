import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import NewsCard from "./screens/NewsCard";
import { Colors, Spacing } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BookmarkScreen: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();

    const bookmarkedNews = Object.values(bookmarks);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
            <Text style={styles.emptySubtitle}>Bookmark articles you want to read later by tapping the save button on any news card.</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
            {bookmarkedNews.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={bookmarkedNews}
                    renderItem={({ item }) => (
                        <NewsCard news={item as any} isBookmarked={true} isLiked={likes.hasOwnProperty((item as any).item_hash)} />
                    )}
                    contentContainerStyle={styles.listContainer}
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
        backgroundColor: Colors.background.secondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.xl,
    },
    emptyTitle: {
        ...Typography.heading.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
        textAlign: "center",
    },
    emptySubtitle: {
        ...Typography.bodyText.medium,
        color: Colors.text.secondary,
        textAlign: "center",
        lineHeight: 24,
    },
    listContainer: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background.secondary,
    },
    separator: {
        height: Spacing.xs,
    },
});

export default BookmarkScreen;
