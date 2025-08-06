import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NewsItem } from "@/features/news/types";
import { useThemeColors } from "@/hooks/useThemeColor";
import { formatCount } from "@/utils/numberFormatter";
import { useLikeAction } from "../hooks/useLikeAction";
import { useBookmarkAction } from "../hooks/useBookmarkAction";
import { useShareAction } from "../hooks/useShareAction";

interface ActionBarProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
    onShare: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ news, isBookmarked, isLiked, onShare }) => {
    const colors = useThemeColors();
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
                    backgroundColor: colors.backgroundColors.primary,
                },
            ]}
        >
            {/* Left side - Action buttons */}
            <View style={styles.actionsContainer}>
                {/* Like Button with Count */}
                <TouchableOpacity style={styles.actionButton} onPress={handleLikePress} activeOpacity={0.7}>
                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? colors.accent.red : colors.gray[500]} />
                    <Text style={[styles.actionText, { color: isLiked ? colors.accent.red : colors.gray[500] }]}>
                        {formatCount(news.metrics.likes)}
                    </Text>
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity style={styles.actionButton} onPress={handleBookmarkPress} activeOpacity={0.7}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={18}
                        color={isBookmarked ? colors.accent.orange : colors.gray[500]}
                    />
                    <Text style={[styles.actionText, { color: isBookmarked ? colors.accent.orange : colors.gray[500] }]}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* Right side - Views and Share Button */}
            <View style={styles.actionsContainer}>
                {/* Views Display */}
                <View style={styles.actionButton}>
                    <Ionicons name="eye-outline" size={18} color={colors.gray[500]} />
                    <Text style={[styles.actionText, { color: colors.gray[500] }]}>{formatCount(news.metrics.views)}</Text>
                </View>

                {/* Share Button */}
                <TouchableOpacity style={[styles.actionButton, styles.lastActionButton]} onPress={handleSharePress} activeOpacity={0.7}>
                    <Ionicons name="share-social-outline" size={18} color={colors.gray[500]} />
                    <Text style={[styles.actionText, { color: colors.gray[500] }]}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ActionBar;