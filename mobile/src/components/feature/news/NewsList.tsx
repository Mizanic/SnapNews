import React from "react";
import { FlatList, View, StyleSheet, RefreshControl, ActivityIndicator, Text } from "react-native";
import NewsCard from "./NewsCard";
import { Spacing, Typography, BorderRadius } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { NewsItem } from "@/lib/types/newsTypes";

interface NewsListProps {
    data: NewsItem[];
    loading: boolean;
    bookmarks: Set<string>;
    likes: Set<string>;
    onRefresh?: () => void;
    refreshing?: boolean;
    onEndReached?: () => void;
    loadingMore?: boolean;
    onScroll?: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
}

const NewsList: React.FC<NewsListProps> = ({
    data,
    loading,
    bookmarks,
    likes,
    onRefresh,
    refreshing = false,
    onEndReached,
    loadingMore = false,
    onScroll,
}) => {
    const colors = useThemeColors();

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
            paddingTop: 32 + Spacing.xl, // Header height + spacing
            paddingBottom: Spacing.xl,
        },
        separator: {
            height: Spacing.xs,
        },
        footerLoader: {
            paddingVertical: Spacing.md,
            alignItems: "center",
        },
    });

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={[styles.footerLoader, { backgroundColor: colors.surface.muted }]}>
                <ActivityIndicator size="small" color={colors.interactive.primary.idle} />
                <Text style={[styles.loadingText, { color: colors.content.secondary }]}>Loading more...</Text>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.surface.muted }}>
                <View style={[styles.listContainer]}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <View
                            key={i}
                            style={{
                                marginBottom: Spacing.sm,
                                marginHorizontal: Spacing.xs,
                                borderRadius: BorderRadius.sm,
                                overflow: "hidden",
                                backgroundColor: colors.surface.base,
                                borderWidth: 1,
                                borderColor: colors.border.subtle,
                            }}
                        >
                            <View style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: colors.surface.muted }} />
                            <View style={{ padding: Spacing.md }}>
                                <View
                                    style={{
                                        width: "80%",
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: colors.surface.muted,
                                        marginBottom: Spacing.xs,
                                    }}
                                />
                                <View
                                    style={{
                                        width: "60%",
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: colors.surface.muted,
                                        marginBottom: Spacing.md,
                                    }}
                                />
                                <View
                                    style={{
                                        width: "100%",
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: colors.surface.muted,
                                        marginBottom: 6,
                                    }}
                                />
                                <View
                                    style={{
                                        width: "90%",
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: colors.surface.muted,
                                        marginBottom: 6,
                                    }}
                                />
                                <View style={{ width: "75%", height: 12, borderRadius: 6, backgroundColor: colors.surface.muted }} />
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ alignItems: "center", paddingBottom: Spacing.md }}>
                    <ActivityIndicator style={{ marginTop: 8 }} size="small" color={colors.interactive.primary.idle} />
                    <Text style={[styles.loadingText, { color: colors.content.secondary }]}>Loading latest news...</Text>
                </View>
            </View>
        );
    }

    if (!loading && data.length === 0) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.surface.muted }]}>
                <Text style={[styles.loadingText, { color: colors.content.secondary }]}>No news to show yet.</Text>
                {onRefresh && <Text style={[styles.loadingText, { color: colors.content.tertiary }]}>Pull to refresh.</Text>}
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
            contentContainerStyle={[styles.listContainer, { backgroundColor: colors.surface.muted }]}
            keyExtractor={(item) => item.item_hash}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.interactive.primary.idle]}
                        tintColor={colors.interactive.primary.idle}
                        progressBackgroundColor={colors.surface.base}
                    />
                ) : undefined
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            onScroll={onScroll}
            scrollEventThrottle={16}
        />
    );
};

export default NewsList;
