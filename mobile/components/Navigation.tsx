import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Platform } from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
            <View style={styles.iconWrapper}>
              <IconComponent
                name={name}
                size={size - 2} // Slightly smaller icon
                color={focused ? "#fff" : "#ccc"}
              />
              {focused && <View style={styles.focusedDot} />}
            </View>
          ),
          tabBarShowLabel: false,
          tabBarBackground: () => (
            <LinearGradient
              colors={["#3a7bd5", "#3a6073"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarStyle: {
            height: 56,
            backgroundColor: "transparent",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            paddingBottom: Platform.OS === "ios" ? 12 : 6,
            paddingTop: 6,
            position: "absolute",
            borderTopWidth: 0,
            elevation: 3,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
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
  },
  focusedDot: {
    width: 24,
    height: 2,
    backgroundColor: "#fff",
    marginTop: 3,
    borderRadius: 4,
  },
});

export default MainTabs;
