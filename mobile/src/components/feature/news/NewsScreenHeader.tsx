import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, Typography, BorderRadius } from "@/styles";
import { TimeFilter } from "@/lib/types/timeFilter";
import { BlurView } from "expo-blur";
import { useTheme } from "@/contexts/ThemeContext";

interface NewsScreenHeaderProps {
    title: string;
    selectedCategoriesCount: number;
    selectedTimeFilter: TimeFilter;
    hasActiveFilters: boolean;
    hasActiveSort: boolean;
    onFilterPress: () => void;
    onSortPress: () => void;
    isVisible?: boolean;
}

const NewsScreenHeader: React.FC<NewsScreenHeaderProps> = ({
    title,
    selectedCategoriesCount,
    selectedTimeFilter,
    hasActiveFilters,
    hasActiveSort,
    onFilterPress,
    onSortPress,
    isVisible = true,
}) => {
    const colors = useThemeColors();
    const { colorScheme } = useTheme();
    const translateYAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(translateYAnim, {
            toValue: isVisible ? 0 : -60, // Slide up by most of header height
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [isVisible, translateYAnim]);

    const getTimeFilterDisplayText = (filter: TimeFilter) => {
        switch (filter) {
            case "all":
                return "All";
            case "today":
                return "Today";
            case "48h":
                return "48h";
            case "96h":
                return "96h";
            case "7d":
                return "7d";
            case "14d":
                return "14d";
            default:
                return "All";
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.backgroundColors.primary,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
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

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    transform: [
                        {
                            translateY: translateYAnim,
                        },
                    ],
                },
            ]}
        >
            {Platform.OS === "ios" && (
                <BlurView intensity={95} tint={colorScheme === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
            )}
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
        </Animated.View>
    );
};

export default NewsScreenHeader;
