import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, Typography, BorderRadius } from "@/styles";

interface FilterOptionItemProps {
    iconName: string;
    title: string;
    description?: string;
    selected: boolean;
    onPress?: () => void;
    testID?: string;
    style?: ViewStyle;
    showCheck?: boolean;
}

const FilterOptionItem: React.FC<FilterOptionItemProps> = ({
    iconName,
    title,
    description,
    selected,
    onPress,
    testID,
    style,
    showCheck = true,
}) => {
    const colors = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.md,
            marginVertical: Spacing.xxs,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            backgroundColor: selected ? colors.selection.accent.background : colors.surface.muted,
            borderColor: selected ? colors.selection.accent.border : colors.border.subtle,
        },
        icon: {
            marginRight: Spacing.md,
        },
        content: {
            flex: 1,
        },
        title: {
            ...Typography.bodyText.large,
            color: colors.content.primary,
            fontWeight: "500",
        },
        description: {
            ...Typography.bodyText.small,
            color: colors.content.secondary,
            marginTop: 2,
        },
        checkIcon: {
            marginLeft: Spacing.sm,
        },
    });

    return (
        <TouchableOpacity testID={testID} style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
            <Ionicons
                name={iconName as any}
                size={22}
                color={selected ? colors.selection.accent.icon : colors.content.secondary}
                style={styles.icon}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {description ? <Text style={styles.description}>{description}</Text> : null}
            </View>
            {showCheck && selected ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.selection.accent.icon} style={styles.checkIcon} />
            ) : null}
        </TouchableOpacity>
    );
};

export default FilterOptionItem;
