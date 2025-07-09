import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import NewsList from "@/components/news/NewsList";
import { useSelector } from "react-redux";
import { Spacing } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewsItem } from "@/model/newsItem";
import { Typography } from "@/constants/Fonts";
import { useQuery } from "@tanstack/react-query";

const fetchLatestNews = async (): Promise<NewsItem[]> => {
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
    return data?.body?.news || [];
};

const LatestNewsScreen: React.FC = () => {
    const bookmarks = useSelector((state: any) => state.bookmarks);
    const likes = useSelector((state: any) => state.likes);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const {
        data: newsData,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["latestNews"],
        queryFn: fetchLatestNews,
    });

    if (isError) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: colors.backgroundColors.secondary }]}>
                <Text style={[styles.errorText, { color: colors.textColors.primary }]}>{(error as Error).message}</Text>
                <Button title="Retry" onPress={() => refetch()} color={colors.primary[600]} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom, backgroundColor: colors.backgroundColors.secondary }]}>
            <NewsList
                data={newsData || []}
                loading={isLoading}
                bookmarks={new Set(Object.keys(bookmarks))}
                likes={new Set(Object.keys(likes))}
                onRefresh={refetch}
                refreshing={isRefetching}
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
