import React from "react";
import { FlatList, ActivityIndicator, View, StyleSheet, Text, RefreshControl } from "react-native";
import NewsCard from "./NewsCard";
import { Spacing } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";
import { useThemeColors } from "@/hooks/useThemeColor";
import { NewsItem } from "@/model/newsItem";

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
            <View style={[styles.loadingContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
                <Text style={[styles.loadingText, { color: colors.textColors.secondary }]}>Loading latest news...</Text>
            </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
    },
    loadingText: {
        ...Typography.bodyText.medium,
        marginTop: Spacing.md,
        textAlign: "center",
    },
    listContainer: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    separator: {
        height: Spacing.xs,
    },
});

export default NewsList;
