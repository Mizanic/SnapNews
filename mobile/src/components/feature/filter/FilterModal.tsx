import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, Typography, BorderRadius, Shadows } from "@/styles";
import { SUPPORTED_CATEGORIES, getCategoryIcon, getCategoryDisplayName, getCategoryDescription } from "@/lib/constants/categories";
import FilterOptionItem from "@/components/feature/filter/FilterOptionItem";

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
    const insets = useSafeAreaInsets();
    const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

    // Calculate available height for modal content - more conservative approach
    const statusBarBuffer = 60; // Buffer for status bar and some spacing from top
    const bottomBuffer = Math.max(50, insets.bottom + 20); // Ensure minimum 50px or safe area + 20px
    const modalMaxHeight = screenHeight - insets.top - statusBarBuffer;
    const headerHeight = 140; // Header + action buttons + drag handle
    const availableScrollHeight = modalMaxHeight - headerHeight - bottomBuffer;

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

    // When modal opens, start with no categories selected
    React.useEffect(() => {
        if (visible) {
            try {
                onClearAll();
            } catch {}
        }
    }, [visible, onClearAll]);

    // Display name, icon, and description are now sourced from shared constants

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: colors.surface.overlay,
            justifyContent: "flex-end",
            paddingBottom: Math.max(20, insets.bottom), // Add bottom padding to overlay
        },
        modalContainer: {
            backgroundColor: colors.surface.base,
            borderTopLeftRadius: BorderRadius.xl,
            borderTopRightRadius: BorderRadius.xl,
            maxHeight: modalMaxHeight,
            paddingTop: Spacing.md,
            ...Shadows.xl,
            overflow: "hidden",
            width: "100%",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.subtle,
        },
        headerTitle: {
            ...Typography.heading.h3,
            color: colors.content.primary,
            fontWeight: "600",
        },
        closeButton: {
            width: 40,
            height: 40,
            borderRadius: BorderRadius.full,
            backgroundColor: colors.surface.muted,
            alignItems: "center",
            justifyContent: "center",
        },
        actionButtons: {
            flexDirection: "row",
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            gap: Spacing.md,
        },
        // scrollArea removed: flex on ScrollView inside a content-sized container can
        // collapse height and hide content. Let it size to content instead.
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
            backgroundColor: colors.surface.muted,
            borderColor: colors.border.default,
        },
        selectAllButton: {
            // Align with chip highlight (orange)
            backgroundColor: colors.accent.orange + "20",
            borderColor: colors.accent.orange + "40",
        },
        actionButtonText: {
            ...Typography.bodyText.medium,
            fontWeight: "500",
        },
        clearButtonText: {
            color: colors.content.secondary,
        },
        selectAllButtonText: {
            color: colors.accent.orange,
        },
        categoriesContainer: {
            paddingHorizontal: Spacing.lg,
            maxHeight: availableScrollHeight,
        },
        categoryItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            marginVertical: Spacing.xxs,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
        },
        categorySelected: {
            // Match time filter highlight: subtle orange bg + orange border
            backgroundColor: colors.accent.orange + "20",
            borderColor: colors.accent.orange + "40",
        },
        categoryUnselected: {
            backgroundColor: colors.surface.muted,
            borderColor: colors.border.subtle,
        },
        categoryIcon: {
            marginRight: Spacing.md,
        },
        categoryContent: {
            flex: 1,
        },
        categoryName: {
            ...Typography.bodyText.large,
            color: colors.content.primary,
            fontWeight: "500",
        },
        // Selected text colors remain the same as time filter chips
        // (no special selected variant)
        categoryDescription: {
            ...Typography.bodyText.small,
            color: colors.content.secondary,
            marginTop: 2,
        },
        // No special selected variant for description either
        checkIcon: {
            marginLeft: Spacing.sm,
        },
        dragHandle: {
            width: 40,
            height: 4,
            backgroundColor: colors.border.default,
            borderRadius: BorderRadius.sm,
            alignSelf: "center",
            marginBottom: Spacing.md,
        },
    });

    // Description centralized via getCategoryDescription

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
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
                                    <Ionicons name="close" size={20} color={colors.content.secondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={onClearAll} activeOpacity={0.7}>
                                    <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.selectAllButton]}
                                    onPress={onSelectAll}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.actionButtonText, styles.selectAllButtonText]}>Select All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Categories List */}
                            <ScrollView
                                style={styles.categoriesContainer}
                                contentContainerStyle={{
                                    paddingBottom: Math.max(60, insets.bottom + 40), // More aggressive bottom padding
                                    paddingTop: Spacing.sm,
                                }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={true}
                                bounces={true}
                            >
                                {SUPPORTED_CATEGORIES.map((category) => (
                                    <FilterOptionItem
                                        key={category}
                                        iconName={getCategoryIcon(category) as any}
                                        title={getCategoryDisplayName(category)}
                                        description={getCategoryDescription(category)}
                                        selected={selectedCategories.has(category)}
                                        onPress={() => onCategoryToggle(category)}
                                    />
                                ))}
                            </ScrollView>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </SafeAreaView>
        </Modal>
    );
};

export default FilterModal;
