import React from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import NewsCard from "./NewsCard";
import { Spacing } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { NewsItem } from "@/model/newsItem";
import NewsCardSkeleton from "./NewsCardSkeleton";

// TODO: Add types
const NewsList = ({
    data,
    loading,
    bookmarks,
    likes,
    onRefresh,
    refreshing = false,
}: {
    data: NewsItem[];
    loading: boolean;
    bookmarks: Set<string>;
    likes: Set<string>;
    onRefresh?: () => void;
    refreshing?: boolean;
}) => {
    const colors = useThemeColors();

    if (loading && !refreshing) {
        return (
            <FlatList
                data={Array.from({ length: 5 })}
                renderItem={() => <NewsCardSkeleton />}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.listContainer, { backgroundColor: colors.backgroundColors.secondary }]}
            />
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => (
                <NewsCard
                    news={item}
                    isBookmarked={bookmarks.has(item.item_hash) ? true : false}
                    isLiked={likes.has(item.item_hash) ? true : false}
                />
            )}
            contentContainerStyle={[styles.listContainer, { backgroundColor: colors.backgroundColors.secondary }]}
            keyExtractor={(item) => item.item_hash}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary[600]]}
                        tintColor={colors.primary[600]}
                        progressBackgroundColor={colors.backgroundColors.primary}
                    />
                ) : undefined
            }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    separator: {
        height: Spacing.xs,
    },
});

export default NewsList;
