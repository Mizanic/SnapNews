import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { useSelector } from "react-redux";
import { Spacing, Typography } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTopNews } from "@/hooks/useNewsQueries";
import NewsList from "@/components/feature/news/NewsList";
import { NewsFiltersProvider, useNewsFiltersContext } from "@/components/shared/filters";

// Content component that uses the filters context
const TopNewsContent: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const colors = useThemeColors();
    const { filteredNewsData } = useNewsFiltersContext();

    const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useTopNews();

    // Handle load more
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isError) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
                <Text style={[styles.errorText, { color: colors.textColors.primary }]}>{(error as Error).message}</Text>
                <Button title="Retry" onPress={() => refetch()} color={colors.primary[600]} />
            </View>
        );
    }

    return (
        <NewsList
            data={filteredNewsData}
            loading={isLoading}
            bookmarks={new Set(Object.keys(bookmarks))}
            likes={new Set(Object.keys(likes))}
            onRefresh={() => refetch()}
            refreshing={isRefetching}
            onEndReached={handleLoadMore}
            loadingMore={isFetchingNextPage}
        />
    );
};

// Main component that provides the filters
const TopNewsScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const { data } = useTopNews();

    // Flatten data pages into a single array of news items
    const allNewsData = React.useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.news);
    }, [data?.pages]);

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            <NewsFiltersProvider title="Top News" newsData={allNewsData}>
                <TopNewsContent />
            </NewsFiltersProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.lg,
    },
    errorText: {
        ...Typography.bodyText.large,
        textAlign: "center",
        marginBottom: Spacing.md,
    },
});

export default TopNewsScreen;
