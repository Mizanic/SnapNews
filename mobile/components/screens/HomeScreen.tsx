import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import NewsList from "./NewsList";
import { Home, Heart, Newspaper } from "lucide-react-native";

const HomeScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState("latest");
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://kpjqcaz45k.execute-api.us-east-1.amazonaws.com/v1/feed");
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

    const renderContent = () => <NewsList data={newsData} loading={loading} />;

    return (
        <View className="flex-1 justify-between">
            <View className="flex-1">{renderContent()}</View>
            <View className="flex-row justify-around p-2 bg-white dark:bg-gray-800 shadow-inner">
                <TouchableOpacity onPress={() => setActiveTab("top")}>
                    <Newspaper color={activeTab === "top" ? "pink" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("latest")}>
                    <Home color={activeTab === "latest" ? "pink" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("favorites")}>
                    <Heart color={activeTab === "favorites" ? "pink" : "gray"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;
