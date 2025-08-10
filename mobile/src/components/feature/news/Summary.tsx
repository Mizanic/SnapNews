import { Text, StyleSheet } from "react-native";
import { Typography } from "@/styles";
import { NewsItem } from "@/lib/types/newsTypes";
import { useThemeColors } from "@/hooks/useThemeColor";

const Summary: React.FC<{ newsItem: NewsItem }> = ({ newsItem }) => {
    const colors = useThemeColors();

    const styles = StyleSheet.create({
        summary: {
            ...Typography.bodyText.medium,
            color: colors.content.secondary,
        },
    });

    return <Text style={styles.summary}>{newsItem.summary}</Text>;
};

export default Summary;
