import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, Typography, BorderRadius, Shadows } from "@/styles";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    selectedCategories: Set<string>;
    onCategoryToggle: (category: string) => void;
    onClearAll: () => void;
    onSelectAll: () => void;
}

const { height: screenHeight } = Dimensions.get("window");

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, selectedCategories, onCategoryToggle, onClearAll, onSelectAll }) => {
    const colors = useThemeColors();
    const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        } else {
            Animated.spring(slideAnim, {
                toValue: screenHeight,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        }
    }, [visible, slideAnim]);

    const getCategoryDisplayName = (category: string) => {
        return category === "ALL" ? "All News" : category.charAt(0) + category.slice(1).toLowerCase();
    };

    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
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
        return icons[category] || "newspaper-outline";
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: colors.backgroundColors.opaque,
            justifyContent: "flex-end",
        },
        modalContainer: {
            backgroundColor: colors.backgroundColors.primary,
            borderTopLeftRadius: BorderRadius.xl,
            borderTopRightRadius: BorderRadius.xl,
            maxHeight: screenHeight * 0.7,
            paddingTop: Spacing.md,
            ...Shadows.xl,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColors.light,
        },
        headerTitle: {
            ...Typography.heading.h3,
            color: colors.textColors.primary,
            fontWeight: "600",
        },
        closeButton: {
            width: 40,
            height: 40,
            borderRadius: BorderRadius.full,
            backgroundColor: colors.backgroundColors.secondary,
            alignItems: "center",
            justifyContent: "center",
        },
        actionButtons: {
            flexDirection: "row",
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            gap: Spacing.md,
        },
        actionButton: {
            flex: 1,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
        },
        clearButton: {
            backgroundColor: colors.backgroundColors.secondary,
            borderColor: colors.borderColors.medium,
        },
        selectAllButton: {
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[200],
        },
        actionButtonText: {
            ...Typography.bodyText.medium,
            fontWeight: "500",
        },
        clearButtonText: {
            color: colors.textColors.secondary,
        },
        selectAllButtonText: {
            color: colors.primary[600],
        },
        categoriesContainer: {
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.xl,
        },
        categoryItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.md,
            marginVertical: 2,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
        },
        categorySelected: {
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[200],
        },
        categoryUnselected: {
            backgroundColor: colors.backgroundColors.secondary,
            borderColor: colors.borderColors.light,
        },
        categoryIcon: {
            marginRight: Spacing.md,
        },
        categoryContent: {
            flex: 1,
        },
        categoryName: {
            ...Typography.bodyText.large,
            color: colors.textColors.primary,
            fontWeight: "500",
        },
        categoryDescription: {
            ...Typography.bodyText.small,
            color: colors.textColors.secondary,
            marginTop: 2,
        },
        checkIcon: {
            marginLeft: Spacing.sm,
        },
        dragHandle: {
            width: 40,
            height: 4,
            backgroundColor: colors.borderColors.medium,
            borderRadius: BorderRadius.sm,
            alignSelf: "center",
            marginBottom: Spacing.md,
        },
    });

    const getCategoryDescription = (category: string) => {
        const descriptions: { [key: string]: string } = {
            ALL: "All news from all sources",
            INDIA: "News from India",
            TECH: "Technology and innovation",
            WORLD: "International news",
            SPORTS: "Sports news and updates",
            BUSINESS: "Business and finance",
            CRICKET: "Cricket news and scores",
            HEALTH: "Health and wellness",
            TOP: "Top trending stories",
        };
        return descriptions[category] || "News category";
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <TouchableOpacity activeOpacity={1}>
                        {/* Drag Handle */}
                        <View style={styles.dragHandle} />

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Filter Categories</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                                <Ionicons name="close" size={20} color={colors.textColors.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={onClearAll} activeOpacity={0.7}>
                                <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.selectAllButton]} onPress={onSelectAll} activeOpacity={0.7}>
                                <Text style={[styles.actionButtonText, styles.selectAllButtonText]}>Select All</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Categories List */}
                        <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
                            {SUPPORTED_CATEGORIES.map((category) => {
                                const isSelected = selectedCategories.has(category);
                                return (
                                    <TouchableOpacity
                                        key={category}
                                        style={[styles.categoryItem, isSelected ? styles.categorySelected : styles.categoryUnselected]}
                                        onPress={() => onCategoryToggle(category)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={getCategoryIcon(category) as any}
                                            size={22}
                                            color={isSelected ? colors.primary[600] : colors.textColors.secondary}
                                            style={styles.categoryIcon}
                                        />
                                        <View style={styles.categoryContent}>
                                            <Text style={styles.categoryName}>{getCategoryDisplayName(category)}</Text>
                                            <Text style={styles.categoryDescription}>{getCategoryDescription(category)}</Text>
                                        </View>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={20} color={colors.primary[600]} style={styles.checkIcon} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

export default FilterModal;
