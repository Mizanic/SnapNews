import React from "react";
import { View, StyleSheet, Text, Dimensions, Platform } from "react-native";
import ImageSection from "./ImageSection";
import ActionBar from "./ActionBar";
import { NewsItem } from "@/model/newsItem";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/constants/Fonts";
import { Colors, Spacing, Shadows, BorderRadius } from "@/constants/Theme";

interface NewsCardProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, isBookmarked, isLiked }) => {
    const formatRelativeTime = (dateValue: string | number) => {
        const publishedDate =
            !isNaN(Number(dateValue)) && String(dateValue).length === 10
                ? new Date(parseInt(String(dateValue)) * 1000)
                : new Date(dateValue);

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;

        if (diffInSeconds < minute) {
            return "just now";
        } else if (diffInSeconds < hour) {
            const minutes = Math.floor(diffInSeconds / minute);
            return `${minutes}m ago`;
        } else if (diffInSeconds < day) {
            const hours = Math.floor(diffInSeconds / hour);
            return `${hours}h ago`;
        } else if (diffInSeconds < week) {
            const days = Math.floor(diffInSeconds / day);
            return `${days}d ago`;
        } else {
            const weeks = Math.floor(diffInSeconds / week);
            return `${weeks}w ago`;
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageWrapper}>
                <ImageSection image={news.media.image_url} label={news.source} />

                {/* Top overlay with metadata */}
                <View style={styles.topOverlay}>
                    <View style={styles.metadataContainer}>
                        <View style={styles.timeChip}>
                            <Text style={styles.timeText}>{formatRelativeTime(news.published)}</Text>
                        </View>
                        <View style={styles.sourceChip}>
                            <Text style={styles.sourceText}>{news.source}</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom gradient overlay with title */}
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradientOverlay}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headlineText} numberOfLines={3}>
                            {news.headline}
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.summaryText} numberOfLines={3}>
                    {news.summary}
                </Text>
            </View>

            {/* Always visible action bar */}
            <View style={styles.actionBarWrapper}>
                <ActionBar news={news} isBookmarked={isBookmarked} isLiked={isLiked} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background.primary,
        borderRadius: BorderRadius.sm,
        overflow: "hidden",
        marginBottom: Spacing.lg,
        marginHorizontal: Spacing.md,
        ...Shadows.lg,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    imageWrapper: {
        position: "relative",
        width: "100%",
        aspectRatio: 16 / 9,
        overflow: "hidden",
    },
    topOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: Spacing.md,
        zIndex: 10,
    },
    metadataContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    timeChip: {
        backgroundColor: Colors.secondary[800],
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    timeText: {
        ...Typography.captionText.medium,
        color: Colors.white,
        fontWeight: "600",
    },
    sourceChip: {
        backgroundColor: Colors.primary[600],
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    sourceText: {
        ...Typography.captionText.medium,
        color: Colors.white,
        fontWeight: "600",
    },
    gradientOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.lg,
        paddingTop: Spacing.xxxl,
        justifyContent: "flex-end",
    },
    titleContainer: {
        marginBottom: Spacing.sm,
    },
    headlineText: {
        ...Typography.heading.h3,
        color: Colors.white,
        fontWeight: "700",
        textShadowColor: Colors.shadow.dark,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    contentContainer: {
        padding: Spacing.md,
        backgroundColor: Colors.background.primary,
    },
    summaryText: {
        ...Typography.bodyText.medium,
        color: Colors.text.secondary,
        lineHeight: 22,
    },
    actionBarWrapper: {
        backgroundColor: Colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
    },
});

export default NewsCard;
