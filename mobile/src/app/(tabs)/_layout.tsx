import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Platform } from "react-native";
import TopNewsScreen from "./top";
import LatestNewsScreen from "./index";
import BookmarkScreen from "./bookmarks";
import { Shadows, BorderRadius } from "@/styles";
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
                    tabBarShowLabel: true,
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
