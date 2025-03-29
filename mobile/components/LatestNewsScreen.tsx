import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import NewsList from "./screens/NewsList";
import { Home, User, Heart, Newspaper } from "lucide-react-native";

const LatestNewsScreen = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://kpjqcaz45k.execute-api.us-east-1.amazonaws.com/v1/feed"
      );
      const data = await response.json();
      setNewsData(data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [activeTab]);

  // const renderContent = () => <NewsList data={newsData} loading={loading} />;
  console.info("LatestNewsScreen", newsData);
  return (
    <View style={styles.container}>
      <NewsList data={newsData} loading={loading} />
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
