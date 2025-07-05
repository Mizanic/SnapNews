import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import TopNewsScreen from "./TopNewsScreen";
import LatestNewsScreen from "./LatestNewsScreen";
import BookmarkScreen from "./BookmarkScreen";
import { Spacing, Shadows, BorderRadius } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import useColorScheme from "@/hooks/useColorScheme.web";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabParamList = {
    "Top News": undefined;
    "Latest News": undefined;
    Bookmark: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const colorScheme = useColorScheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const icons: Record<string, { name: string; lib: any }> = {
                    "Top News": { name: "trending-up", lib: MaterialCommunityIcons },
                    "Latest News": { name: "flash", lib: Ionicons },
                    Bookmark: { name: "bookmark", lib: MaterialIcons },
                };

                const { name, lib: IconComponent } = icons[route.name];

                return {
                    tabBarIcon: ({ focused, size }) => (
                        <View style={[styles.iconWrapper, focused && { backgroundColor: colors.primary[50] }]}>
                            <View style={[styles.iconContainer, focused && { backgroundColor: colors.white, ...Shadows.sm }]}>
                                <IconComponent
                                    name={name}
                                    size={focused ? size : size - 2}
                                    color={focused ? colors.primary[600] : colors.gray[500]}
                                />
                            </View>
                            {focused && <View style={[styles.focusedIndicator, { backgroundColor: colors.primary[600] }]} />}
                        </View>
                    ),
                    tabBarShowLabel: false,
                    tabBarBackground: () =>
                        Platform.OS === "ios" ? (
                            <BlurView intensity={95} tint={colorScheme === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                        ) : (
                            <View
                                style={[
                                    StyleSheet.absoluteFill,
                                    {
                                        backgroundColor: colors.backgroundColors.primary,
                                        borderTopLeftRadius: BorderRadius.xl,
                                        borderTopRightRadius: BorderRadius.xl,
                                    },
                                ]}
                            />
                        ),
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
                    headerShown: false,
                };
            }}
        >
            <Tab.Screen name="Top News" component={TopNewsScreen} />
            <Tab.Screen name="Latest News" component={LatestNewsScreen} />
            <Tab.Screen name="Bookmark" component={BookmarkScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        minWidth: 60,
        minHeight: 44,
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: BorderRadius.md,
        marginBottom: 2,
    },
    focusedIndicator: {
        width: 24,
        height: 3,
        borderRadius: BorderRadius.sm,
        marginTop: 2,
    },
});

export default MainTabs;
