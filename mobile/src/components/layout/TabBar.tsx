import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Platform, Animated } from "react-native";
import { BorderRadius, Spacing, Shadows } from "@/styles";
import { BlurView } from "expo-blur";
import React from "react";
import { useHaptics } from "@/hooks/useHaptics";

const TabBar = ({ state, navigation, colors, insets, colorScheme }: any) => {
    const icons: Record<string, { name: string; lib: any }> = {
        Hot: { name: "flame", lib: Ionicons },
        Latest: { name: "flash", lib: Ionicons },
        Bookmark: { name: "bookmark", lib: Ionicons },
    };

    const styles = StyleSheet.create({
        tabBarContainer: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: BorderRadius.xl,
            borderTopRightRadius: BorderRadius.xl,
            ...Shadows.lg,
            ...Platform.select({
                ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        tabBarContent: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingTop: Spacing.sm,
        },
        iconWrapper: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            minWidth: 60,
            minHeight: 44,
        },
        focusedIndicator: {
            width: 24,
            height: 3,
            borderRadius: BorderRadius.sm,
            marginTop: Spacing.sm,
        },
    });

    return (
        <View style={[styles.tabBarContainer, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]}>
            {Platform.OS === "ios" && (
                <BlurView intensity={95} tint={colorScheme === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
            )}
            {Platform.OS !== "ios" && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: colors.surface.base,
                        },
                    ]}
                />
            )}
            <View style={styles.tabBarContent}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const { name, lib: IconComponent } = icons[route.name];
                    const scaleAnimRef = React.useRef(new Animated.Value(isFocused ? 1.1 : 1)).current;
                    const { triggerHaptic } = useHaptics();

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                        // Subtle haptic feedback on tab press (if enabled in settings)
                        try {
                            triggerHaptic && triggerHaptic((require("expo-haptics") as any).ImpactFeedbackStyle.Light);
                        } catch {}
                    };

                    React.useEffect(() => {
                        Animated.timing(scaleAnimRef, {
                            toValue: isFocused ? 1.1 : 1,
                            duration: 200,
                            useNativeDriver: true,
                        }).start();
                    }, [isFocused, scaleAnimRef]);

                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7}>
                            <Animated.View style={[{ transform: [{ scale: scaleAnimRef }] }, isFocused && { ...Shadows.sm }]}>
                                <IconComponent
                                    name={name}
                                    size={isFocused ? 24 : 22}
                                    color={isFocused ? colors.accent.redditRed : colors.content.tertiary}
                                />
                            </Animated.View>
                            {isFocused && <View style={[styles.focusedIndicator, { backgroundColor: colors.accent.redditRed }]} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default TabBar;
