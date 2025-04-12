import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Animated } from "react-native";
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import TopNewsScreen from "./TopNewsScreen";
import LatestNewsScreen from "./LatestNewsScreen";
import BookmarkScreen from "./BookmarkScreen";

type TabParamList = {
  "Top News": undefined;
  "Latest News": undefined;
  Bookmark: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icons: Record<string, { name: string; lib: any }> = {
          "Top News": { name: "newspaper", lib: MaterialCommunityIcons },
          "Latest News": { name: "flash", lib: Ionicons },
          Bookmark: { name: "bookmark-added", lib: MaterialIcons },
        };

        const { name, lib: IconComponent } = icons[route.name];

        return {
          tabBarIcon: ({ focused, size }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <IconComponent
                name={name}
                size={size}
                color={focused ? "#ff007f" : "#888"}
              />
              {focused && (
                <Animated.View
                  style={{
                    width: 30,
                    height: 3,
                    backgroundColor: "#ff007f",
                    marginTop: 4,
                    borderRadius: 10,
                  }}
                />
              )}
            </View>
          ),
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#000",
            paddingTop: 10,
            borderTopWidth: 0,
            elevation: 5,
            height: 60,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
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

export default MainTabs;
