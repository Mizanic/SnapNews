import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { addLike, removeLike } from "@/dux/action/like/likeActions";
import { useDispatch } from "react-redux";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { Typography } from "@/constants/Fonts";

interface LikeButtonProps {
    item_hash: string;
    isLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ item_hash, isLiked }) => {
    const dispatch = useDispatch();

    const toggleLike = () => {
        if (!isLiked) {
            dispatch(addLike(item_hash));
        } else {
            dispatch(removeLike(item_hash));
        }
    };

    return (
        <TouchableOpacity onPress={toggleLike} style={[styles.button, isLiked && styles.buttonActive]} activeOpacity={0.7}>
            <View style={styles.buttonContent}>
                <MaterialIcons
                    name={isLiked ? "thumb-up" : "thumb-up-off-alt"}
                    size={20}
                    color={isLiked ? Colors.white : Colors.gray[600]}
                    style={{ marginRight: Spacing.xs }}
                />
                <Text style={[styles.buttonText, isLiked && styles.buttonTextActive]}>Like</Text>
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
        backgroundColor: Colors.primary[600],
        borderColor: Colors.primary[600],
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

export default LikeButton;
