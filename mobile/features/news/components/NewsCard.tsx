import React, { useRef } from "react";
import { View, StyleSheet, Text, Dimensions, Platform, TouchableOpacity } from "react-native";
import ImageSection from "./ImageSection";
import ActionBar from "./ActionBar";
import { NewsItem } from "@/features/news/types";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/constants/Fonts";
import { Spacing, Shadows, BorderRadius } from "@/constants/Theme";
import { useThemeColors } from "@/hooks/useThemeColor";
import * as WebBrowser from "expo-web-browser";
import ViewShot from "react-native-view-shot";

interface NewsCardProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, isBookmarked, isLiked }) => {
    const colors = useThemeColors();
    const viewShotRef = useRef<ViewShot>(null);

    const formatRelativeTime = (dateValue: string | number) => {
        const publishedDate =
            !isNaN(Number(dateValue)) && String(dateValue).length === 10 ? new Date(parseInt(String(dateValue)) * 1000) : new Date(dateValue);

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

    const handleCardPress = async () => {
        try {
            await WebBrowser.openBrowserAsync(news.news_url);
        } catch (error) {
            console.error("Error opening URL:", error);
        }
    };

    return (
        <TouchableOpacity onPress={handleCardPress} activeOpacity={0.95} style={styles.touchableCard}>
            <ViewShot ref={viewShotRef}>
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.backgroundColors.primary,
                            borderColor: colors.borderColors.light,
                            shadowColor: colors.black,
                        },
                    ]}
                >
                    <View style={styles.imageWrapper}>
                        <ImageSection
                            image={news.media.image_url}
                            sourceName={news.source_name}
                            timeLabel={formatRelativeTime(news.published)}
                        />

                        {/* Bottom gradient overlay with title */}
                        <LinearGradient colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradientOverlay}>
                            <View style={styles.titleContainer}>
                                <Text
                                    style={[
                                        styles.headlineText,
                                        {
                                            color: colors.white,
                                            textShadowColor: colors.shadowColors.dark,
                                        },
                                    ]}
                                    numberOfLines={3}
                                >
                                    {news.headline}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={[styles.contentContainer, { backgroundColor: colors.backgroundColors.primary }]}>
                        <Text style={[styles.summaryText, { color: colors.textColors.secondary }]} numberOfLines={19}>
                            {news.summary}
                        </Text>
                    </View>

                    {/* Always visible action bar */}
                    <View
                        style={[
                            styles.actionBarWrapper,
                            {
                                backgroundColor: colors.backgroundColors.primary,
                                borderTopColor: colors.borderColors.light,
                            },
                        ]}
                    >
                        <ActionBar news={news} isBookmarked={isBookmarked} isLiked={isLiked} viewShotRef={viewShotRef} />
                    </View>
                </View>
            </ViewShot>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableCard: {
        marginBottom: Spacing.md,
        marginHorizontal: Spacing.xs,
    },
    card: {
        borderRadius: BorderRadius.sm,
        overflow: "hidden",
        ...Shadows.lg,
        borderWidth: 1,
    },
    imageWrapper: {
        position: "relative",
        width: "100%",
        aspectRatio: 16 / 9,
        overflow: "hidden",
    },

    gradientOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.sm,
        paddingTop: Spacing.xxxl,
        justifyContent: "flex-end",
    },
    titleContainer: {
        marginBottom: Spacing.xs,
    },
    headlineText: {
        ...Typography.heading.h3,
        fontWeight: "700",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    contentContainer: {
        padding: Spacing.md,
    },
    summaryText: {
        ...Typography.bodyText.medium,
        lineHeight: 22,
    },
    actionBarWrapper: {
        borderTopWidth: 1,
    },
});

export default NewsCard;
