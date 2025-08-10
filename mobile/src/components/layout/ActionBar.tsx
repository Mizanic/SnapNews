import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NewsItem } from "@/lib/types/newsTypes";
import { useThemeColors } from "@/hooks/useThemeColor";
import { formatCount } from "@/lib/utils/numberFormatter";
import { useLikeAction } from "@/hooks/useLikeAction";
import { useBookmarkAction } from "@/hooks/useBookmarkAction";
import { useShareAction } from "@/hooks/useShareAction";

interface ActionBarProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
    onShare: () => void;
}

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 } as const;

const ActionBar: React.FC<ActionBarProps> = ({ news, isBookmarked, isLiked, onShare }) => {
    const colors = useThemeColors();
    const likeScale = React.useRef(new Animated.Value(1)).current;
    const bookmarkScale = React.useRef(new Animated.Value(1)).current;
    const shareScale = React.useRef(new Animated.Value(1)).current;
    const bounce = (anim: Animated.Value) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
            Animated.spring(anim, { toValue: 1, useNativeDriver: true }),
        ]).start();
    };
    const { handleLikePress } = useLikeAction(news, isLiked);
    const { handleBookmarkPress } = useBookmarkAction(news, isBookmarked);
    const { handleSharePress } = useShareAction(news, onShare);

    const styles = StyleSheet.create({
        actionBar: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        actionsContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            marginRight: 24,
            paddingVertical: 4,
            paddingHorizontal: 4,
        },
        actionText: {
            fontSize: 14,
            fontWeight: "400",
            marginLeft: 6,
        },
        sourceText: {
            fontSize: 14,
            fontWeight: "400",
        },
        lastActionButton: {
            marginRight: 0,
        },
    });

    return (
        <View
            style={[
                styles.actionBar,
                {
                    backgroundColor: colors.surface.base,
                },
            ]}
        >
            {/* Left side - Action buttons */}
            <View style={styles.actionsContainer}>
                {/* Like Button with Count */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        bounce(likeScale);
                        handleLikePress();
                    }}
                    activeOpacity={0.7}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={isLiked ? "Unlike article" : "Like article"}
                >
                    <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={18}
                            color={isLiked ? colors.status.error : colors.content.tertiary}
                        />
                    </Animated.View>
                    <Text style={[styles.actionText, { color: isLiked ? colors.status.error : colors.content.tertiary }]}>
                        {formatCount(news.metrics.likes)}
                    </Text>
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        bounce(bookmarkScale);
                        handleBookmarkPress();
                    }}
                    activeOpacity={0.7}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={isBookmarked ? "Remove bookmark" : "Save article"}
                >
                    <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
                        <Ionicons
                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                            size={18}
                            color={isBookmarked ? colors.accent.orange : colors.content.tertiary}
                        />
                    </Animated.View>
                    <Text style={[styles.actionText, { color: isBookmarked ? colors.accent.orange : colors.content.tertiary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* Right side - Views and Share Button */}
            <View style={styles.actionsContainer}>
                {/* Views Display */}
                <View style={styles.actionButton}>
                    <Ionicons name="eye-outline" size={18} color={colors.content.tertiary} />
                    <Text style={[styles.actionText, { color: colors.content.tertiary }]}>{formatCount(news.metrics.views)}</Text>
                </View>

                {/* Share Button */}
                <TouchableOpacity
                    style={[styles.actionButton, styles.lastActionButton]}
                    onPress={() => {
                        bounce(shareScale);
                        handleSharePress();
                    }}
                    activeOpacity={0.7}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel="Share article"
                >
                    <Animated.View style={{ transform: [{ scale: shareScale }] }}>
                        <Ionicons name="share-social-outline" size={18} color={colors.content.tertiary} />
                    </Animated.View>
                    <Text style={[styles.actionText, { color: colors.content.tertiary }]}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ActionBar;
