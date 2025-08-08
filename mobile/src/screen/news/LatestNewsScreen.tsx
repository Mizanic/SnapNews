import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { useSelector } from "react-redux";
import { Spacing, Typography } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLatestNews } from "@/hooks/useNewsQueries";
import NewsList from "@/components/feature/news/NewsList";
import { useNewsFilters } from "@/hooks/useNewsFilters";
import NewsScreenHeader from "@/components/feature/news/NewsScreenHeader";
import FilterModal from "@/components/feature/news/FilterModal";
import SortModal from "@/components/feature/news/SortModal";

const LatestNewsScreen: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useLatestNews();

    // Flatten data pages into a single array of news items
    const allNewsData = React.useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.news);
    }, [data?.pages]);

    // Use the simple filter hook with default of "14d" for latest news
    const {
        filteredNewsData,
        selectedCategories,
        selectedTimeFilter,
        hasActiveFilters,
        hasActiveSort,
        toggleCategory,
        clearAllCategories,
        selectAllCategories,
        setSelectedTimeFilter,
        filterModalVisible,
        sortModalVisible,
        openFilterModal,
        closeFilterModal,
        openSortModal,
        closeSortModal,
    } = useNewsFilters(allNewsData, "all");

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
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            <NewsScreenHeader
                title="Latest"
                selectedCategoriesCount={selectedCategories.size}
                selectedTimeFilter={selectedTimeFilter}
                hasActiveFilters={hasActiveFilters}
                hasActiveSort={hasActiveSort}
                onFilterPress={openFilterModal}
                onSortPress={openSortModal}
            />

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

            <FilterModal
                visible={filterModalVisible}
                onClose={closeFilterModal}
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
                onClearAll={clearAllCategories}
                onSelectAll={selectAllCategories}
            />

            <SortModal
                visible={sortModalVisible}
                onClose={closeSortModal}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterSelect={setSelectedTimeFilter}
            />
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

export default LatestNewsScreen;
