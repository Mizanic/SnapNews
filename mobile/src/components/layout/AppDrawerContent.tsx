import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { SUPPORTED_CATEGORIES, getCategoryIcon, getCategoryDisplayName } from "@/lib/constants/categories";
import { Spacing, Typography, BorderRadius } from "@/styles";
import { useFilterContext } from "@/contexts/FilterContext";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Category icon and display name are now centralized in constants

const AppDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { navigation } = props;
    const colors = useThemeColors();
    const { selectedCategories, setSelectedCategories, clearAllCategories } = useFilterContext();
    const insets = useSafeAreaInsets();

    // Only highlight a single category if exactly one is selected; otherwise highlight none
    const activeCategory: string | null = React.useMemo(() => {
        if (selectedCategories.size === 1) {
            return Array.from(selectedCategories)[0];
        }
        return null;
    }, [selectedCategories]);

    const isAllActive = selectedCategories.size === 0 || selectedCategories.size === SUPPORTED_CATEGORIES.length;

    const styles = StyleSheet.create({
        scroll: { flex: 1, backgroundColor: colors.surface.base },
        container: { backgroundColor: colors.surface.base, paddingTop: insets.top + Spacing.md },
        header: {
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.subtle,
        },
        headerTitle: { ...Typography.heading.h3, color: colors.content.primary },
        sectionTitle: {
            ...Typography.bodyText.small,
            color: colors.content.secondary,
            marginTop: Spacing.md,
            marginBottom: Spacing.xs,
            paddingHorizontal: Spacing.md,
        },
        categoryItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadius.md,
        },
        categorySelected: {
            // Match time filter highlight: subtle orange bg + orange border
            backgroundColor: colors.accent.orange + "20",
            borderColor: colors.accent.orange + "40",
            borderWidth: 1,
        },
        categoryUnselected: {
            backgroundColor: "transparent",
        },
        categoryIcon: { marginRight: Spacing.sm },
        categoryText: { ...Typography.bodyText.medium, marginLeft: Spacing.sm, color: colors.content.primary },
        categoryTextSelected: {
            ...Typography.bodyText.medium,
            marginLeft: Spacing.sm,
            color: colors.accent.orange,
            fontWeight: "600",
        },
        metaText: { ...Typography.bodyText.medium, marginLeft: Spacing.sm, color: colors.content.primary },
        metaTextActive: { color: colors.accent.orange, fontWeight: "600" },
    });

    const handleCategoryPress = (category: string) => {
        const cat = category.toUpperCase();
        setSelectedCategories(new Set([cat]));
        navigation.closeDrawer();
    };

    return (
        <DrawerContentScrollView {...props} style={styles.scroll} contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
            </View>
            <Text style={styles.sectionTitle}>Quick Filters</Text>
            {/* Meta category: All Categories (drawer-only) */}
            <TouchableOpacity
                style={[styles.categoryItem, isAllActive && styles.categorySelected]}
                onPress={() => {
                    clearAllCategories();
                    navigation.closeDrawer();
                }}
            >
                <Ionicons
                    name={getCategoryIcon("ALL")}
                    size={18}
                    color={isAllActive ? colors.white : colors.content.secondary}
                    style={styles.categoryIcon}
                />
                <Text style={[styles.metaText, isAllActive && styles.metaTextActive]}>{getCategoryDisplayName("ALL")}</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Categories</Text>
            {SUPPORTED_CATEGORIES.map((category) => {
                const isSelected = activeCategory === category;
                return (
                    <TouchableOpacity
                        key={category}
                        style={[styles.categoryItem, isSelected ? styles.categorySelected : styles.categoryUnselected]}
                        onPress={() => handleCategoryPress(category)}
                    >
                        <Ionicons
                            name={getCategoryIcon(category)}
                            size={18}
                            color={isSelected ? colors.white : colors.content.secondary}
                            style={styles.categoryIcon}
                        />
                        <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>{getCategoryDisplayName(category)}</Text>
                    </TouchableOpacity>
                );
            })}
        </DrawerContentScrollView>
    );
};

export default AppDrawerContent;
