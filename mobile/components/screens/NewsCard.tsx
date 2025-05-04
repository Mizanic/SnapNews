import { View, StyleSheet } from "react-native";
import ImageSection from "./ImageSection";
import Header from "./Header";
import Summary from "./Summary";
import ActionBar from "./ActionBar";
import { NewsItem } from "@/model/newsItem";

interface NewsCardProps {
  news: NewsItem;
  isBookmarked : boolean;
  isLiked: boolean;
}

const NewsCard = ({ news ,isBookmarked, isLiked}: NewsCardProps) => (
  <View style={styles.card}>
    <View style={styles.imageWrapper}>
      <ImageSection image={news.media.image_url} label={news.source} />
      <View style={styles.overlay}>
        <Header title={news.headline} />
      </View>
    </View>
    <View style={styles.content}>
      <Summary description={news.summary} />
    </View>
    <ActionBar news={news} isBookmarked={isBookmarked} isLiked={isLiked}/>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imageWrapper: {
    position: "relative",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay background
  },
  content: {
    padding: 16,
    color: "white",
  },
});

export default NewsCard;
