import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import TopNewsScreen from "../components/TopNewsScreen";
import LatestNewsScreen from "../components/LatestNewsScreen";
import FavoritesScreen from "../components/FavoritesScreen";

type TabParamList = {
  "Top News": undefined;
  "Latest News": undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Top News":
              iconName = "trending-up";
              break;
            case "Latest News":
              iconName = "update";
              break;
            case "Favorites":
              iconName = "favorite-outline";
              break;
            default:
              iconName = "circle";
          }

          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons
                name={iconName}
                size={size}
                color={focused ? "#ff007f" : "#888"}
              />
              {focused && (
                <View
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
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000",
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Top News" component={TopNewsScreen} />
      <Tab.Screen name="Latest News" component={LatestNewsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
