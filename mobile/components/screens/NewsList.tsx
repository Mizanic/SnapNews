import React from "react";
import { FlatList, ActivityIndicator, View, StyleSheet } from "react-native";
import NewsCard from "./NewsCard";

// TODO: Add types
const NewsList = ({ data, loading, bookmarks, likes }: any) => {
    return loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff007f" />
        </View>
    ) : (
        <FlatList
            data={data}
            renderItem={({ item }) => (
                <NewsCard
                    news={item}
                    isBookmarked={bookmarks.has(item.item_hash) ? true : false}
                    isLiked={likes.has(item.item_hash) ? true : false}
                />
            )}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.item_hash}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});

export default NewsList;
