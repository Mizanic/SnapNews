import { Text, StyleSheet } from "react-native";
import { Typography } from "@/styles/theme";
import { NewsItem } from "@/features/news/types";
import { useThemeColors } from "@/hooks/useThemeColor";

const Summary: React.FC<{ newsItem: NewsItem }> = ({ newsItem }) => {
    const colors = useThemeColors();

    const styles = StyleSheet.create({
        summary: {
            ...Typography.bodyText.medium,
            color: colors.textColors.secondary,
        },
    });

    return <Text style={styles.summary}>{newsItem.summary}</Text>;
};

export default Summary;