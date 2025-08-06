import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import TopNewsScreen from "./top";
import LatestNewsScreen from "./index";
import BookmarkScreen from "./bookmarks";
import { Spacing, Shadows, BorderRadius } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import useColorScheme from "@/hooks/useColorScheme.web";
import AppHeader from "@/components/layout/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabParamList = {
    "Top News": undefined;
    "Latest News": undefined;
    Bookmark: undefined;
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1 }}>
            <AppHeader />
            <Tab.Navigator
                initialRouteName="Latest News"
                tabBarPosition="bottom"
                screenOptions={{
                    tabBarStyle: {
                        height: 60 + insets.bottom,
                        paddingBottom: insets.bottom,
                        backgroundColor: Platform.OS === "ios" ? "transparent" : colors.backgroundColors.primary,
                        borderTopWidth: 0,
                        borderTopLeftRadius: BorderRadius.xl,
                        borderTopRightRadius: BorderRadius.xl,
                        position: "absolute",
                        ...Shadows.lg,
                        ...Platform.select({
                            ios: {
                                shadowColor: colors.black,
                                shadowOffset: { width: 0, height: -8 },
                                shadowOpacity: 0.1,
                                shadowRadius: 16,
                            },
                            android: {
                                elevation: 8,
                            },
                        }),
                    },
                    tabBarShowLabel: false,
                    tabBarIndicatorStyle: { height: 0 }, // Hide the top indicator
                    swipeEnabled: true,
                }}
                tabBar={(props) => <CustomTabBar {...props} colors={colors} insets={insets} colorScheme={colorScheme} />}
            >
                <Tab.Screen name="Top News" component={TopNewsScreen} />
                <Tab.Screen name="Latest News" component={LatestNewsScreen} />
                <Tab.Screen name="Bookmark" component={BookmarkScreen} />
            </Tab.Navigator>
        </View>
    );
};

const CustomTabBar = ({ state, descriptors, navigation, colors, insets, colorScheme }: any) => {
    const icons: Record<string, { name: string; lib: any }> = {
        "Top News": { name: "trending-up", lib: MaterialCommunityIcons },
        "Latest News": { name: "flash", lib: Ionicons },
        Bookmark: { name: "bookmark", lib: MaterialIcons },
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
            marginTop: 2,
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
                            backgroundColor: colors.backgroundColors.primary,
                        },
                    ]}
                />
            )}
            <View style={styles.tabBarContent}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const { name, lib: IconComponent } = icons[route.name];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={[styles.iconWrapper, isFocused && { backgroundColor: colors.primary[50] }]}
                            activeOpacity={0.7}
                        >
                            <View style={[isFocused && { backgroundColor: colors.white, ...Shadows.sm }]}>
                                <IconComponent
                                    name={name}
                                    size={isFocused ? 24 : 22}
                                    color={isFocused ? colors.primary[600] : colors.gray[500]}
                                />
                            </View>
                            {isFocused && <View style={[styles.focusedIndicator, { backgroundColor: colors.primary[600] }]} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default MainTabs;
