import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, Typography, BorderRadius } from "@/styles";
import { TimeFilter } from "@/hooks/useNewsFilters";

interface NewsScreenHeaderProps {
    title: string;
    selectedCategoriesCount: number;
    selectedTimeFilter: TimeFilter;
    onFilterPress: () => void;
    onSortPress: () => void;
}

const NewsScreenHeader: React.FC<NewsScreenHeaderProps> = ({
    title,
    selectedCategoriesCount,
    selectedTimeFilter,
    onFilterPress,
    onSortPress,
}) => {
    const colors = useThemeColors();

    const getTimeFilterDisplayText = (filter: TimeFilter) => {
        switch (filter) {
            case "today":
                return "Today";
            case "48h":
                return "48h";
            case "96h":
                return "96h";
            case "7d":
                return "7d";
            default:
                return "Today";
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.backgroundColors.primary,
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColors.light,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        titleContainer: {
            flex: 1,
        },
        title: {
            ...Typography.heading.h2,
            color: colors.textColors.primary,
            fontWeight: "600",
        },
        actionsContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.sm,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            backgroundColor: colors.backgroundColors.secondary,
            borderWidth: 1,
            borderColor: colors.borderColors.light,
        },
        filterButton: {
            minWidth: 60,
        },
        sortButton: {
            minWidth: 55,
        },
        activeFilterButton: {
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[200],
        },
        activeSortButton: {
            backgroundColor: colors.accent.orange + "20",
            borderColor: colors.accent.orange + "40",
        },
        actionButtonText: {
            ...Typography.bodyText.small,
            fontWeight: "500",
            marginLeft: 4,
        },
        filterButtonText: {
            color: colors.textColors.secondary,
        },
        activeFilterButtonText: {
            color: colors.primary[600],
        },
        sortButtonText: {
            color: colors.textColors.secondary,
        },
        activeSortButtonText: {
            color: colors.accent.orange,
        },
        badge: {
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: colors.accent.red,
            borderRadius: BorderRadius.full,
            minWidth: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 4,
        },
        badgeText: {
            ...Typography.bodyText.small,
            color: colors.white,
            fontSize: 10,
            fontWeight: "600",
        },
    });

    const hasActiveFilters = selectedCategoriesCount > 0 && selectedCategoriesCount < 9; // Total categories - 1 for ALL
    const hasActiveSort = selectedTimeFilter !== "today";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.actionsContainer}>
                    {/* Filter Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.filterButton, hasActiveFilters && styles.activeFilterButton]}
                        onPress={onFilterPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="filter-outline"
                            size={18}
                            color={hasActiveFilters ? colors.primary[600] : colors.textColors.secondary}
                        />
                        <Text style={[styles.actionButtonText, styles.filterButtonText, hasActiveFilters && styles.activeFilterButtonText]}>
                            Filter
                        </Text>
                        {hasActiveFilters && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{selectedCategoriesCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Sort Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.sortButton, hasActiveSort && styles.activeSortButton]}
                        onPress={onSortPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="time-outline" size={18} color={hasActiveSort ? colors.accent.orange : colors.textColors.secondary} />
                        <Text style={[styles.actionButtonText, styles.sortButtonText, hasActiveSort && styles.activeSortButtonText]}>
                            {getTimeFilterDisplayText(selectedTimeFilter)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default NewsScreenHeader;
