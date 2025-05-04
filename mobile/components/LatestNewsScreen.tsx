import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import NewsList from "./screens/NewsList";
import { Home, User, Heart, Newspaper } from "lucide-react-native";
import { useSelector } from "react-redux";

const LatestNewsScreen = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const bookmarks = useSelector(
    (state) => state.bookmarks
  );
  const likes = useSelector(
    (state) => state.likes
  );

  const fetchNews = async () => {
    setLoading(true);
    try {
      // const response = await fetch(
      //   "https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed?country=IND&language=ENG&category=LATEST&page_key=1745031039"
      // );
      // const data = await response.json();
      // setNewsData(data?.body?.news);
      const item = [{
        "summary": "Trump’s new tariffs spark biggest Dow wipeout since 2020",
        "published": "1743752322",
        "url_hash": "5b65b1b213a7c3adf230a3380b7ba2a699216d2e3da8a65a309a305d3c796264",
        "media": {
          "image_url": "https://static.toiimg.com/photo/msid-119962027,imgsize-867304.cms",
          "video_url": null
        },
        "headline": "US markets tumble",
        "news_url": "https://timesofindia.indiatimes.com/world/us/us-markets-tumble-donald-trumps-new-tariffs-spark-biggest-dow-wipeout-since-2020-2-trillion/articleshow/119961733.cms",
        "ttl": "1744961922",
        "sk": "1743752322",
        "source": "TimesOfIndia",
        "pk": "NEWS"
      }];
      setNewsData(item);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <NewsList
        data={newsData}
        loading={loading}
        bookmarks={new Set(Object.keys(bookmarks))}
        likes={new Set(Object.keys(likes))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default LatestNewsScreen;
