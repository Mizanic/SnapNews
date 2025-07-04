import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { addBookmark, removeBookmark } from "@/dux/action/bookmark/bookmarkActions";
import { useDispatch } from "react-redux";
import { NewsItem } from "@/model/newsItem";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";

interface BookmarkButtonProps {
    news: NewsItem;
    isBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ news, isBookmarked }) => {
    const dispatch = useDispatch();

    const toggleBookmark = () => {
        if (!isBookmarked) {
            dispatch(addBookmark(news));
        } else {
            dispatch(removeBookmark(news.item_hash));
        }
    };

    return (
        <TouchableOpacity onPress={toggleBookmark} style={[styles.button, isBookmarked && styles.buttonActive]} activeOpacity={0.7}>
            <View style={styles.buttonContent}>
                <MaterialIcons
                    name={isBookmarked ? "bookmark" : "bookmark-border"}
                    size={20}
                    color={isBookmarked ? Colors.white : Colors.gray[600]}
                    style={{ marginRight: Spacing.xs }}
                />
                <Text style={[styles.buttonText, isBookmarked && styles.buttonTextActive]}>Save</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.background.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border.medium,
        minWidth: 80,
        ...Shadows.sm,
    },
    buttonActive: {
        backgroundColor: Colors.accent.yellow,
        borderColor: Colors.accent.yellow,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        ...Typography.button.small,
        color: Colors.text.secondary,
    },
    buttonTextActive: {
        color: Colors.white,
    },
});

export default BookmarkButton;
