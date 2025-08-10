import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useDrawer } from "@/contexts/DrawerContext";
import { SUPPORTED_CATEGORIES } from "@/lib/constants/categories";
import { Spacing, Typography, BorderRadius } from "@/styles";
import { useRouter } from "expo-router";
import { useFilterContext } from "@/contexts/FilterContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(320, Math.round(SCREEN_WIDTH * 0.82));

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

const SideDrawer: React.FC = () => {
    const { isOpen, closeDrawer } = useDrawer();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setSelectedCategories } = useFilterContext();

    const translateX = useSharedValue(-DRAWER_WIDTH);
    const backdropOpacity = useSharedValue(0);
    const panStartX = useSharedValue(-DRAWER_WIDTH);

    React.useEffect(() => {
        const targetX = isOpen ? 0 : -DRAWER_WIDTH;
        translateX.value = withTiming(targetX, { duration: 240, easing: Easing.out(Easing.cubic) });
        backdropOpacity.value = withTiming(isOpen ? 0.35 : 0, { duration: 240, easing: Easing.out(Easing.cubic) });
    }, [isOpen, translateX, backdropOpacity]);

    // Pan gesture for dragging the drawer when open
    const drawerPan = React.useMemo(
        () =>
            Gesture.Pan()
                .enabled(isOpen)
                .minDistance(5)
                .onBegin(() => {
                    panStartX.value = translateX.value;
                })
                .onUpdate((e) => {
                    const proposed = Math.max(-DRAWER_WIDTH, Math.min(0, panStartX.value + e.translationX));
                    translateX.value = proposed;
                })
                .onEnd((e) => {
                    const current = translateX.value;
                    const shouldClose = current < -DRAWER_WIDTH / 2 || e.velocityX < -300;
                    if (shouldClose) {
                        runOnJS(closeDrawer)();
                    } else {
                        translateX.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) });
                    }
                }),
        [isOpen, translateX, closeDrawer]
    );

    // Edge pan gesture to pull drawer in when closed
    const edgePan = React.useMemo(
        () =>
            Gesture.Pan()
                .enabled(!isOpen)
                .minDistance(3)
                .onBegin(() => {
                    panStartX.value = -DRAWER_WIDTH;
                    translateX.value = -DRAWER_WIDTH;
                })
                .onUpdate((e) => {
                    const proposed = Math.max(-DRAWER_WIDTH, Math.min(0, -DRAWER_WIDTH + e.translationX));
                    translateX.value = proposed;
                })
                .onEnd((e) => {
                    const current = translateX.value;
                    const openedEnough = current > -DRAWER_WIDTH * 0.7 || e.velocityX > 300;
                    if (openedEnough) {
                        translateX.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) });
                    } else {
                        runOnJS(closeDrawer)();
                    }
                }),
        [isOpen, translateX, closeDrawer]
    );

    const backdropAnimatedStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
    const drawerAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

    const handleCategoryPress = (category: string) => {
        const categoryParam = category.toUpperCase();

        // Update global filter immediately
        setSelectedCategories(new Set([categoryParam]));
        // Also push params so deep links work when navigating elsewhere
        router.push({ pathname: "/(tabs)", params: { category: categoryParam } } as any);
        closeDrawer();
    };

    const styles = StyleSheet.create({
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.black,
            zIndex: 9998,
        },
        container: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: DRAWER_WIDTH,
            backgroundColor: colors.backgroundColors.primary,
            borderRightColor: colors.borderColors.light,
            borderRightWidth: 1,
            paddingTop: insets.top + Spacing.md,
            zIndex: 9999,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.md,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColors.light,
        },
        headerTitle: {
            ...Typography.heading.h3,
            color: colors.textColors.primary,
        },
        sectionTitle: {
            ...Typography.bodyText.small,
            color: colors.textColors.secondary,
            marginTop: Spacing.md,
            marginBottom: Spacing.xs,
            paddingHorizontal: Spacing.md,
        },
        categoryItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            marginHorizontal: Spacing.sm,
        },
        categoryText: {
            ...Typography.bodyText.medium,
            marginLeft: Spacing.sm,
            color: colors.textColors.primary,
        },
        footerSpace: {
            height: insets.bottom + Spacing.lg,
        },
    });

    return (
        <>
            {/* Narrow edge area to start opening when closed */}
            {!isOpen && (
                <GestureDetector gesture={edgePan}>
                    <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 24, zIndex: 9997 }} pointerEvents="box-only" />
                </GestureDetector>
            )}

            {/* Backdrop */}
            <Animated.View pointerEvents={isOpen ? "auto" : "none"} style={[styles.backdrop, backdropAnimatedStyle]}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeDrawer} />
            </Animated.View>

            {/* Drawer with interactive gesture */}
            <GestureDetector gesture={drawerPan}>
                <Animated.View style={[styles.container, drawerAnimatedStyle]}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Menu</Text>
                        <TouchableOpacity onPress={closeDrawer}>
                            <Ionicons name="close" size={22} color={colors.textColors.secondary} />
                        </TouchableOpacity>
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

                    <View style={styles.footerSpace} />
                </Animated.View>
            </GestureDetector>
        </>
    );
};

export default SideDrawer;
