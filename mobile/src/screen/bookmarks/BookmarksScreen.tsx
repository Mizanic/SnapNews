import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Spacing, Typography } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NewsCard from "@/components/feature/news/NewsCard";
import { useNewsFilters } from "@/hooks/useNewsFilters";
import { NewsScreenHeader, FilterModal, SortModal } from "@/components/shared/filters";
import { NewsItem } from "@/lib/types/newsTypes";

const BookmarkScreen: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const bookmarkedNews: NewsItem[] = Object.values(bookmarks);

    // Use the simple filter hook
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
    } = useNewsFilters(bookmarkedNews);

    const renderEmptyState = () => (
        <View style={[styles.emptyContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
            <Text style={[styles.emptyTitle, { color: colors.textColors.primary }]}>No Bookmarks Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textColors.secondary }]}>
                Bookmark articles you want to read later by tapping the save button on any news card.
            </Text>
        </View>
    );

    if (bookmarkedNews.length === 0) {
        return (
            <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
                {renderEmptyState()}
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            <NewsScreenHeader
                title="Bookmarks"
                selectedCategoriesCount={selectedCategories.size}
                selectedTimeFilter={selectedTimeFilter}
                hasActiveFilters={hasActiveFilters}
                hasActiveSort={hasActiveSort}
                onFilterPress={openFilterModal}
                onSortPress={openSortModal}
            />

            {filteredNewsData.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={filteredNewsData}
                    renderItem={({ item }) => <NewsCard news={item} isBookmarked={true} isLiked={likes.hasOwnProperty(item.item_hash)} />}
                    contentContainerStyle={[styles.listContainer, { backgroundColor: colors.backgroundColors.secondary }]}
                    keyExtractor={(item) => item.item_hash}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}

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
