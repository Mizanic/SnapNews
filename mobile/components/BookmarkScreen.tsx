import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import NewsList from "./screens/NewsList";

const BookmarkScreen = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    return (
        <View style={styles.container}>
            <NewsList data={Object.values(bookmarks)} bookmarks={new Set(Object.keys(bookmarks))} likes={new Set(Object.keys(likes))} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingBottom: 70,
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
    },
});

export default BookmarkScreen;
