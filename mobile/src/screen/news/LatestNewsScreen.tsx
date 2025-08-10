import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { useSelector } from "react-redux";
import { Spacing, Typography } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLatestNews } from "@/hooks/useNewsQueries";
import NewsList from "@/components/feature/news/NewsList";
import { useNewsFilters } from "@/hooks/useNewsFilters";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import NewsScreenHeader from "@/components/feature/filter/NewsScreenHeader";
import FilterModal from "@/components/feature/filter/FilterModal";
import SortModal from "@/components/feature/filter/SortModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { TimeFilter } from "@/lib/types/timeFilter";

const LatestNewsScreen: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useLatestNews();
    const router = useRouter();
    const params = useLocalSearchParams<{ category?: string; time?: TimeFilter }>();

    const initialCategories = React.useMemo(() => {
        if (params?.category && typeof params.category === "string") {
            const upper = params.category.toUpperCase();
            if (SUPPORTED_CATEGORIES.includes(upper)) {
                if (upper === "ALL") return new Set(SUPPORTED_CATEGORIES);
                return new Set([upper]);
            }
        }
        return undefined;
    }, [params?.category]);

    const initialTime = React.useMemo<TimeFilter | undefined>(() => {
        const t = params?.time;
        if (!t) return undefined;
        const allowed: TimeFilter[] = ["all", "today", "48h", "96h", "7d", "14d"];
        return allowed.includes(t as TimeFilter) ? (t as TimeFilter) : undefined;
    }, [params?.time]);

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
    } = useNewsFilters(allNewsData, initialTime || "all", initialCategories);

    // Push category and time changes into the URL for sharable state
    // DISABLED: This creates infinite loops when params change from sidebar
    // React.useEffect(() => {
    //     // Derive category: if all selected, use ALL; if single selected, use that; otherwise omit
    //     let categoryParam: string | undefined = undefined;
    //     if (selectedCategories.size === SUPPORTED_CATEGORIES.length) {
    //         categoryParam = "ALL";
    //     } else if (selectedCategories.size === 1) {
    //         categoryParam = Array.from(selectedCategories)[0];
    //     }

    //     const next = new URLSearchParams();
    //     if (categoryParam) next.set("category", categoryParam);
    //     if (selectedTimeFilter) next.set("time", selectedTimeFilter);

    //     router.setParams(Object.fromEntries(next.entries()) as any);
    // }, [router, selectedCategories, selectedTimeFilter]);

    // Use scroll direction hook for header animation
    const { isHeaderVisible, onScroll } = useScrollDirection();

    // Handle load more
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isError) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: colors.surface.muted }]}>
                <Text style={[styles.errorText, { color: colors.content.primary }]}>{(error as Error).message}</Text>
                <Button title="Retry" onPress={() => refetch()} color={colors.interactive.primary.idle} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.surface.muted }]}>
            <NewsScreenHeader
                title="Latest"
                selectedCategoriesCount={selectedCategories.size}
                selectedTimeFilter={selectedTimeFilter}
                hasActiveFilters={hasActiveFilters}
                hasActiveSort={hasActiveSort}
                onFilterPress={openFilterModal}
                onSortPress={openSortModal}
                isVisible={isHeaderVisible}
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
                onScroll={onScroll}
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
