import { View, StyleSheet } from "react-native";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import { NewsItem } from "@/model/newsItem";
import LikeButton from "./LikeButton";

interface ActionBarProps {
    news: NewsItem;
    isBookmarked: boolean;
    isLiked: boolean;
}

const ActionBar = ({ news, isBookmarked, isLiked }: ActionBarProps) => {
    return (
        <View style={styles.actionBar}>
            <LikeButton item_hash={news.item_hash} isLiked={isLiked} />
            <BookmarkButton news={news} isBookmarked={isBookmarked} />
            <ShareButton newsSourceUrl={news.news_url} />
        </View>
    );
};

const styles = StyleSheet.create({
    actionBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
});

export default ActionBar;
