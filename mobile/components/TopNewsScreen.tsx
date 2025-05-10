import { View, Text, StyleSheet } from "react-native";
import React from "react";

const TopNewsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Top News Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default TopNewsScreen;
