import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { Spacing, Typography, BorderRadius } from "@/styles";
import { useFilterContext } from "@/contexts/FilterContext";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

const getCategoryIcon = (category: string): any => {
    const icons: Record<string, string> = {
        ALL: "globe-outline",
        INDIA: "location-outline",
        TECH: "laptop-outline",
        WORLD: "earth-outline",
        SPORTS: "football-outline",
        BUSINESS: "business-outline",
        CRICKET: "baseball-outline",
        HEALTH: "medical-outline",
        TOP: "trending-up-outline",
    };
    return (icons[category] || "newspaper-outline") as any;
};

const AppDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
    const colors = useThemeColors();
    const { setSelectedCategories } = useFilterContext();

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.backgroundColors.primary, paddingTop: Spacing.lg },
        header: {
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColors.light,
        },
        headerTitle: { ...Typography.heading.h3, color: colors.textColors.primary },
        sectionTitle: {
            ...Typography.bodyText.small,
            color: colors.textColors.secondary,
            marginTop: Spacing.md,
            marginBottom: Spacing.xs,
            paddingHorizontal: Spacing.lg,
        },
        categoryItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            borderRadius: BorderRadius.md,
        },
        categoryText: { ...Typography.bodyText.medium, marginLeft: Spacing.sm, color: colors.textColors.primary },
    });

    const handleCategoryPress = (category: string) => {
        const cat = category.toUpperCase();
        setSelectedCategories(new Set([cat]));
        navigation.closeDrawer();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
            </View>
            <Text style={styles.sectionTitle}>Categories</Text>
            {SUPPORTED_CATEGORIES.map((category) => (
                <TouchableOpacity key={category} style={styles.categoryItem} onPress={() => handleCategoryPress(category)}>
                    <Ionicons name={getCategoryIcon(category)} size={18} color={colors.textColors.secondary} />
                    <Text style={styles.categoryText}>
                        {category === "ALL" ? "All News" : category.charAt(0) + category.slice(1).toLowerCase()}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default AppDrawerContent;
