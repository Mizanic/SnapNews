import { View, StyleSheet, Text, Dimensions } from "react-native";
import ImageSection from "./ImageSection";
import Header from "./Header";
import Summary from "./Summary";
import ActionBar from "./ActionBar";
import { NewsItem } from "@/model/newsItem";
import { LinearGradient } from "expo-linear-gradient";

interface NewsCardProps {
  news: NewsItem;
  isBookmarked: boolean;
  isLiked: boolean;
}

const NewsCard = ({ news, isBookmarked, isLiked }: NewsCardProps) => {
  // Format the published date as a relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateValue) => {
    // Get the published date - handle both Unix timestamp and ISO string
    const publishedDate = !isNaN(dateValue) && dateValue.length === 10
      ? new Date(parseInt(dateValue) * 1000) // Convert Unix timestamp to milliseconds
      : new Date(dateValue);
      
    const now = new Date();
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);
    
    // Calculate different time units
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    
    // Return appropriate relative time string
    if (diffInSeconds < minute) {
      return "just now";
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / week);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <ImageSection image={news.media.image_url} label={news.source} />
        
        {/* Top overlay with published date and source */}
        <View style={styles.topOverlay}>
          <View style={styles.dateWrapper}>
            <Text style={styles.dateText}>
              {formatRelativeTime(news.published)}
            </Text>
          </View>
          <View style={styles.sourceNameWrapper}>
            <Text style={styles.sourceNameText}>
              {news.source_name}
            </Text>
          </View>
        </View>
        
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.85)"]}
          style={styles.overlay}
        >
          <View style={styles.sourceWrapper}>
            <Text style={styles.sourceText}>{news.source}</Text>
          </View>
          <Header title={news.headline} />
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <Summary description={news.summary} />
      </View>

      <ActionBar news={news} isBookmarked={isBookmarked} isLiked={isLiked} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    marginHorizontal: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignSelf: "center",
    width: "100%",
    maxWidth: 600, // Keeps the card centered and responsive on large screens
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9, // Maintain visual consistency across devices
    overflow: "hidden",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    zIndex: 10,
  },
  dateWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  sourceNameWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceNameText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 50,
    justifyContent: "flex-end",
  },
  sourceWrapper: {
    marginBottom: 6,
  },
  sourceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
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