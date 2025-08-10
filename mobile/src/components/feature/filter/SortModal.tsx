import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, Typography, BorderRadius, Shadows } from "@/styles";
import FilterOptionItem from "@/components/feature/filter/FilterOptionItem";
import { TimeFilter } from "@/lib/types/timeFilter";

interface SortModalProps {
    visible: boolean;
    onClose: () => void;
    selectedTimeFilter: TimeFilter;
    onTimeFilterSelect: (filter: TimeFilter) => void;
}

const { height: screenHeight } = Dimensions.get("window");

const SortModal: React.FC<SortModalProps> = ({ visible, onClose, selectedTimeFilter, onTimeFilterSelect }) => {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

    // Calculate available height for modal content - more conservative approach
    const statusBarBuffer = 60; // Buffer for status bar and some spacing from top
    const bottomBuffer = Math.max(50, insets.bottom + 20); // Ensure minimum 50px or safe area + 20px
    const modalMaxHeight = screenHeight - insets.top - statusBarBuffer;
    const headerHeight = 100; // Header + drag handle
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

    const timeFilterOptions = [
        {
            id: "forever" as TimeFilter,
            title: "All Time",
            description: "All available news",
            icon: "infinite-outline",
        },
        {
            id: "today" as TimeFilter,
            title: "Today",
            description: "News from the last 24 hours",
            icon: "today-outline",
        },
        {
            id: "48h" as TimeFilter,
            title: "Last 48 Hours",
            description: "News from the past 2 days",
            icon: "calendar-outline",
        },
        {
            id: "96h" as TimeFilter,
            title: "Last 96 Hours",
            description: "News from the past 4 days",
            icon: "calendar-number-outline",
        },
        {
            id: "7d" as TimeFilter,
            title: "Last 7 Days",
            description: "News from the past week",
            icon: "calendar",
        },
        {
            id: "14d" as TimeFilter,
            title: "Last 14 Days",
            description: "News from the past 2 weeks",
            icon: "calendar",
        },
    ];

    const handleOptionSelect = (filter: TimeFilter) => {
        onTimeFilterSelect(filter);
        onClose();
    };

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
        optionsContainer: {
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            maxHeight: availableScrollHeight,
        },
        // Do not force flex on ScrollView container to avoid collapse
        dragHandle: {
            width: 40,
            height: 4,
            backgroundColor: colors.border.default,
            borderRadius: BorderRadius.sm,
            alignSelf: "center",
            marginBottom: Spacing.md,
        },
    });

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
                                <Text style={styles.headerTitle}>Filter by Time</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                                    <Ionicons name="close" size={20} color={colors.content.secondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Time Filter Options */}
                            <ScrollView
                                style={styles.optionsContainer}
                                contentContainerStyle={{
                                    paddingBottom: Math.max(60, insets.bottom + 40), // More aggressive bottom padding
                                    paddingTop: Spacing.sm,
                                }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={true}
                                bounces={true}
                            >
                                {timeFilterOptions.map((option) => (
                                    <FilterOptionItem
                                        key={option.id}
                                        iconName={option.icon}
                                        title={option.title}
                                        description={option.description}
                                        selected={selectedTimeFilter === option.id}
                                        onPress={() => handleOptionSelect(option.id)}
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

export default SortModal;
