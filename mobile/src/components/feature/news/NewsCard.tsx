import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import ImageSection from "./ImageSection";
import ActionBar from "@/components/layout/ActionBar";
import { NewsItem } from "@/lib/types/newsTypes";
import { LinearGradient } from "expo-linear-gradient";
import { Typography, Spacing, Shadows, BorderRadius } from "@/styles";
import { useThemeColors } from "@/hooks/useThemeColor";
import * as WebBrowser from "expo-web-browser";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";

interface NewsCardProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, isBookmarked, isLiked }) => {
    const colors = useThemeColors();
    const shareViewShotRef = useRef<ViewShot>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (isCapturing) {
            const captureAndShare = async () => {
                try {
                    const uri = await shareViewShotRef.current?.capture?.();
                    if (uri) {
                        const shareOptions = {
                            title: "Check out this news article",
                            message: `Check out this news article: ${news.news_url}`,
                            url: uri,
                        };
                        await Share.open(shareOptions);
                    }
                } catch (error) {
                    if (!(error instanceof Error && error.message.includes("User did not share"))) {
                        Alert.alert("Error", "Unable to share this article");
                    }
                } finally {
                    setIsCapturing(false);
                }
            };
            setTimeout(captureAndShare, 100);
        }
    }, [isCapturing, news.news_url]);

    const handleSharePress = () => {
        setIsCapturing(true);
    };

    const handleCardPress = async () => {
        if (!news.news_url) return;
        try {
            await WebBrowser.openBrowserAsync(news.news_url);
        } catch (error) {
            console.error("Error opening URL:", error);
        }
    };

    const styles = StyleSheet.create({
        touchableCard: {
            marginBottom: Spacing.sm,
            marginHorizontal: Spacing.xs,
        },
        shareViewContainer: {
            position: "absolute",
            top: -9999,
            left: -9999,
            opacity: 0,
            pointerEvents: "none",
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
        shareContentContainer: {
            padding: Spacing.md,
            // Add top padding to ensure space for the overlayed branding element
            paddingTop: Spacing.xl,
        },
        brandingContainer: {
            // Position absolutely over the card
            position: "absolute",
            // Set top to the exact aspect ratio of the image
            top: 0,
            left: 0,
            right: 0,
            // Use aspect ratio to define the container's height, matching the image
            aspectRatio: 16 / 9,
            // Center the branding element at the bottom of this container
            justifyContent: "flex-end",
            alignItems: "center",
            zIndex: 1,
        },
        brandingInner: {
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            // A small negative margin to perfectly center on the edge
            marginBottom: -15,
        },
        brandingText: {
            ...Typography.captionText.large,
            fontWeight: "bold",
        },
        summaryText: {
            ...Typography.bodyText.medium,
            lineHeight: 22,
        },
        actionBarWrapper: {
            borderTopWidth: 0.5,
        },
        sourceContainer: {
            flexDirection: "row",
            marginBottom: Spacing.xs,
        },
        sourceChip: {
            backgroundColor: colors.surface.overlay,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 4,
            borderRadius: BorderRadius.sm,
            ...Shadows.sm,
        },
        sourceText: {
            ...Typography.captionText.small,
            color: colors.white,
            fontWeight: "600",
            fontSize: 11,
        },
    });

    // Render the shareable content (without action bar)
    const renderShareableContent = () => (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface.base,
                    borderColor: colors.border.subtle,
                    shadowColor: colors.black,
                },
            ]}
        >
            <View style={styles.imageWrapper}>
                <ImageSection
                    image={news.media.image_url}
                    timeLabel={formatRelativeTime(news.published)}
                    sourceName={news.source_name}
                    categories={news.categories}
                />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradientOverlay}>
                    {/* Source name above headline */}
                    {news.source_name && (
                        <View style={styles.sourceContainer}>
                            <View style={styles.sourceChip}>
                                <Text style={styles.sourceText}>{news.source_name}</Text>
                            </View>
                        </View>
                    )}
                    <View style={styles.titleContainer}>
                        <Text
                            style={[
                                styles.headlineText,
                                {
                                    color: colors.white,
                                    textShadowColor: colors.elevation.lg,
                                },
                            ]}
                            numberOfLines={3}
                        >
                            {news.headline}
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            {/* Always show branding in shareable content */}
            <View style={styles.brandingContainer}>
                <View
                    style={[
                        styles.brandingInner,
                        {
                            backgroundColor: colors.surface.base,
                        },
                    ]}
                >
                    <Text style={[styles.brandingText, { color: colors.accent.redditRed }]}>SnapNews</Text>
                </View>
            </View>

            <View style={styles.shareContentContainer}>
                <Text style={[styles.summaryText, { color: colors.content.secondary }]} numberOfLines={19}>
                    {news.summary}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.touchableCard}>
            {/* Hidden ViewShot for sharing - positioned absolutely and invisible */}
            <View style={styles.shareViewContainer}>
                <ViewShot ref={shareViewShotRef} options={{ format: "jpg", quality: 0.9, result: "data-uri" }}>
                    {renderShareableContent()}
                </ViewShot>
            </View>

            {/* Visible card content */}

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.surface.base,
                        borderColor: colors.border.subtle,
                        shadowColor: colors.black,
                    },
                ]}
            >
                <TouchableOpacity onPress={handleCardPress} activeOpacity={0.95} accessibilityRole="button" accessibilityLabel="Open article">
                    <View style={styles.imageWrapper}>
                        <ImageSection
                            image={news.media.image_url}
                            timeLabel={formatRelativeTime(news.published)}
                            sourceName={news.source_name}
                            categories={news.categories}
                        />
                        <LinearGradient colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradientOverlay}>
                            {/* Source name above headline */}
                            {news.source_name && (
                                <View style={styles.sourceContainer}>
                                    <View style={styles.sourceChip}>
                                        <Text style={styles.sourceText}>{news.source_name.toUpperCase()}</Text>
                                    </View>
                                </View>
                            )}
                            <View style={styles.titleContainer}>
                                <Text
                                    style={[
                                        styles.headlineText,
                                        {
                                            color: colors.white,
                                            textShadowColor: colors.elevation.lg,
                                        },
                                    ]}
                                    numberOfLines={3}
                                >
                                    {news.headline}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={[styles.summaryText, { color: colors.content.secondary }]} numberOfLines={19}>
                            {news.summary}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View
                    style={[
                        styles.actionBarWrapper,
                        {
                            backgroundColor: colors.surface.base,
                            borderTopColor: colors.border.subtle,
                        },
                    ]}
                >
                    <ActionBar news={news} isBookmarked={isBookmarked} isLiked={isLiked} onShare={handleSharePress} />
                </View>
            </View>
        </View>
    );
};

const formatRelativeTime = (dateValue: string | number) => {
    const publishedDate =
        !isNaN(Number(dateValue)) && String(dateValue).length === 10 ? new Date(parseInt(String(dateValue)) * 1000) : new Date(dateValue);

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (diffInSeconds < minute) return "just now";
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h ago`;
    if (diffInSeconds < week) return `${Math.floor(diffInSeconds / day)}d ago`;
    return `${Math.floor(diffInSeconds / week)}w ago`;
};

export default NewsCard;
