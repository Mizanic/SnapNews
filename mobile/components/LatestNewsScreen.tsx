import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import NewsList from "./screens/NewsList";
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
      const response = await fetch(
        "https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/feed?country=IND&language=ENG&category=LATEST"
      );
      const data = await response.json();
      setNewsData(data?.body?.news);
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
