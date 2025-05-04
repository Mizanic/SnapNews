import { View, StyleSheet, Text, Dimensions } from "react-native";
import ImageSection from "./ImageSection";
import Header from "./Header";
import Summary from "./Summary";
import ActionBar from "./ActionBar";
import { NewsItem } from "@/model/newsItem";
import { LinearGradient } from "expo-linear-gradient"; // Add this to your dependencies

interface NewsCardProps {
  news: NewsItem;
  isBookmarked: boolean;
  isLiked: boolean;
}

const { width } = Dimensions.get("window");

const NewsCard = ({ news, isBookmarked, isLiked }: NewsCardProps) => {
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <ImageSection image={news.media.image_url} label={news.source} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.85)"]}
          style={styles.overlay}
        >
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>{news.source}</Text>
            <Text style={styles.dateText}>{formatDate(news.published_date)}</Text>
          </View>
          <Header title={news.headline} />
        </LinearGradient>
      </View>
      
      <View style={styles.content}>
        <Summary description={news.summary} />
        
        <View style={styles.tagsContainer}>
          {news.categories && news.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <ActionBar news={news} isBookmarked={isBookmarked} isLiked={isLiked} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  imageWrapper: {
    position: "relative",
    height: width * 0.5, // Dynamic height based on screen width
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 50, // Extra space for gradient to look natural
  },
  sourceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sourceText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  dateText: {
    color: "#f0f0f0",
    fontSize: 12,
  },
  content: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: "#fafafa",
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#f0f4f8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  tagText: {
    color: "#506580",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default NewsCard;