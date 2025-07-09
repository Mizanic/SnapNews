import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import NewsList from "@/components/news/NewsList";
import { useSelector } from "react-redux";
import { Spacing } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewsItem } from "@/model/newsItem";
import { Typography } from "@/constants/Fonts";

const LatestNewsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState("latest");
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const fetchNews = async (isRefreshing = false) => {
        if (isRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await fetch("https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/latest?country=IND&language=ENG", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch news");
            }
            const data = await response.json();
            setNewsData(data?.body?.news as NewsItem[]);
        } catch (error) {
            setError("Something went wrong. Please try again later.");
            console.error("Error fetching news:", error);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    const onRefresh = () => {
        fetchNews(true);
    };

    useEffect(() => {
        fetchNews();
    }, [activeTab]);

    if (error && !loading) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
                <Text style={[styles.errorText, { color: colors.textColors.primary }]}>{error}</Text>
                <Button title="Retry" onPress={() => fetchNews()} color={colors.primary[600]} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            <NewsList
                data={newsData}
                loading={loading}
                bookmarks={new Set(Object.keys(bookmarks))}
                likes={new Set(Object.keys(likes))}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.lg,
    },
    errorText: {
        ...Typography.bodyText.large,
        textAlign: "center",
        marginBottom: Spacing.md,
    },
});

export default LatestNewsScreen;
