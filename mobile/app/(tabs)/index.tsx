import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import NewsList from "@/components/news/NewsList";
import { useSelector } from "react-redux";
import { Spacing } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewsItem } from "@/model/newsItem";

const LatestNewsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState("latest");
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
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

        try {
            const response = await fetch("https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed/latest?country=IND&language=ENG", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            setNewsData(data?.body?.news as NewsItem[]);
        } catch (error) {
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
    text: {
        fontSize: 18,
        fontWeight: "500",
    },
});

export default LatestNewsScreen;
