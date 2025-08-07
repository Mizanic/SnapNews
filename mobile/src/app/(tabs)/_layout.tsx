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
import TabBar from "@/components/layout/TabBar";

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
                tabBar={(props) => <TabBar {...props} colors={colors} insets={insets} colorScheme={colorScheme} />}
            >
                <Tab.Screen name="Top News" component={TopNewsScreen} />
                <Tab.Screen name="Latest News" component={LatestNewsScreen} />
                <Tab.Screen name="Bookmark" component={BookmarkScreen} />
            </Tab.Navigator>
        </View>
    );
};

export default MainTabs;
