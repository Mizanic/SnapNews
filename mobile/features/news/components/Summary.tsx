import { Text, StyleSheet } from "react-native";
import { Typography } from "@/constants/Fonts";
import { NewsItem } from "@/features/news/types";

const Summary: React.FC<{ newsItem: NewsItem }> = ({ newsItem }) => <Text style={styles.summary}>{newsItem.summary}</Text>;

const styles = StyleSheet.create({
    summary: {
        ...Typography.body,
        color: "#333",
    },
});

export default Summary;
