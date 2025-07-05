import React from "react";
import { FlatList, ActivityIndicator, View, StyleSheet, Text } from "react-native";
import NewsCard from "./NewsCard";
import { Colors, Spacing } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";

// TODO: Add types
const NewsList = ({ data, loading, bookmarks, likes }: any) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary[600]} />
                <Text style={styles.loadingText}>Loading latest news...</Text>
            </View>
        );
    }

    return (
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background.secondary,
        paddingHorizontal: Spacing.lg,
    },
    loadingText: {
        ...Typography.bodyText.medium,
        color: Colors.text.secondary,
        marginTop: Spacing.md,
        textAlign: "center",
    },
    listContainer: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background.secondary,
    },
    separator: {
        height: Spacing.xs,
    },
});

export default NewsList;
