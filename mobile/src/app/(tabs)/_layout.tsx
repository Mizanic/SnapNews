import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import HotNewsScreen from "./hot";
import LatestNewsScreen from "./index";
import BookmarkScreen from "./bookmarks";
import { useThemeColors } from "@/hooks/useThemeColor";
import useColorScheme from "@/hooks/useColorScheme.web";
import AppHeader from "@/components/layout/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "@/components/layout/TabBar";
import { useLocalSearchParams } from "expo-router";

type TabParamList = {
    Hot: { category?: string; time?: string };
    Latest: { category?: string; time?: string };
    Bookmark: { category?: string; time?: string };
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const colorScheme = useColorScheme();
    const params = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
            <AppHeader />
            <Tab.Navigator
                initialRouteName="Latest"
                tabBarPosition="bottom"
                screenOptions={{
                    tabBarShowLabel: true,
                    tabBarIndicatorStyle: { height: 0 }, // Hide the top indicator
                    swipeEnabled: true,
                }}
                tabBar={(props) => <TabBar {...props} colors={colors} insets={insets} colorScheme={colorScheme} />}
            >
                <Tab.Screen name="Hot" component={HotNewsScreen} initialParams={params as any} />
                <Tab.Screen name="Latest" component={LatestNewsScreen} initialParams={params as any} />
                <Tab.Screen name="Bookmark" component={BookmarkScreen} initialParams={params as any} />
            </Tab.Navigator>
        </View>
    );
};

export default MainTabs;
