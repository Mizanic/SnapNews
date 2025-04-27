import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import NewsList from "./screens/NewsList";
import { RootState } from "@/dux/store";

const BookmarkScreen = () => {
  const bookmarks = useSelector(
    (state: RootState) => state.bookmarkState.bookmarks
  );
  // console.log(Object.values(bookmarks));
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>This is Bookmark Screen</Text> */}
      <NewsList
        data={Object.values(bookmarks)}
        bookmarks={new Set(Object.keys(bookmarks))}
      />
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

export default BookmarkScreen;
