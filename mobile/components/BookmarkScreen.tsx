import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import NewsList from "./screens/NewsList";
import { useSelector } from "react-redux";
import { Spacing } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Typography } from "@/constants/Fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BookmarkScreen: React.FC = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const fetchBookmarkedNews = async () => {
        setLoading(true);
        try {
            const bookmarkHashes = Object.keys(bookmarks);
            if (bookmarkHashes.length === 0) {
                setNewsData([]);
                return;
            }

            const response = await fetch("https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    item_hashes: bookmarkHashes,
                }),
            });

            const data = await response.json();
            setNewsData(data?.body?.news || []);
        } catch (error) {
            console.error("Error fetching bookmarked news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarkedNews();
    }, [bookmarks]);

    if (Object.keys(bookmarks).length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
                <Text style={[styles.emptyText, { color: colors.textColors.primary }]}>No bookmarked articles yet</Text>
                <Text style={[styles.emptySubText, { color: colors.textColors.secondary }]}>
                    Start bookmarking articles to see them here
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            <NewsList data={newsData} loading={loading} bookmarks={new Set(Object.keys(bookmarks))} likes={new Set(Object.keys(likes))} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
    },
    emptyText: {
        ...Typography.heading.h3,
        textAlign: "center",
        marginBottom: Spacing.sm,
    },
    emptySubText: {
        ...Typography.bodyText.medium,
        textAlign: "center",
    },
});

export default BookmarkScreen;
