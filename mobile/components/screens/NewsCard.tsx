import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import ImageSection from "./ImageSection";
import Header from "./Header";
import Summary from "./Summary";
import ActionBar from "./ActionBar";
import { NewsItem } from "../../model/newsItem";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../constants/Fonts";

interface NewsCardProps {
  news: NewsItem;
  isBookmarked: boolean;
  isLiked: boolean;
}

const NewsCard = ({ news, isBookmarked, isLiked }: NewsCardProps) => {
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const formatRelativeTime = (dateValue: string | number) => {
    const publishedDate =
      !isNaN(Number(dateValue)) && String(dateValue).length === 10
        ? new Date(parseInt(String(dateValue)) * 1000)
        : new Date(dateValue);

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - publishedDate.getTime()) / 1000
    );

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (diffInSeconds < minute) {
      return "just now";
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / week);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
  };

  const toggleActionBar = () => {
    if (isActionBarVisible) {
      // Hide ActionBar
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => setIsActionBarVisible(false));
    } else {
      // Show ActionBar
      setIsActionBarVisible(true);
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(scaleValue, {
          toValue: 1.02,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const heightInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const opacityInterpolation = animatedValue;

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: scaleValue.interpolate({
      inputRange: [1, 1.02],
      outputRange: ["#ffffff", "#f9f9f9"],
    }),
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.imageWrapper}>
        <ImageSection image={news.media.image_url} label={news.source} />

        <View style={styles.topOverlay}>
          <View style={styles.dateWrapper}>
            <Text style={styles.dateText}>
              {formatRelativeTime(news.published)}
            </Text>
          </View>
          <View style={styles.sourceNameWrapper}>
            <Text style={styles.sourceNameText}>{news.source}</Text>
          </View>
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.overlay}
        >
          <Header title={news.headline} />
        </LinearGradient>
      </View>

      <TouchableOpacity onPress={toggleActionBar} activeOpacity={1}>
        <View style={styles.content}>
          <Summary description={news.summary} />
        </View>

        <Animated.View
          style={[
            styles.actionBarWrapper,
            {
              height: heightInterpolation,
              opacity: opacityInterpolation,
            },
          ]}
        >
          <ActionBar
            news={news}
            isBookmarked={isBookmarked}
            isLiked={isLiked}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
    alignSelf: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
    overflow: "hidden",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    zIndex: 10,
  },
  dateWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dateText: {
    color: "#fff",
    ...Typography.caption,
  },
  sourceNameWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sourceNameText: {
    color: "#fff",
    ...Typography.caption,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 80,
    justifyContent: "flex-end",
  },
  content: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: "#ffffff",
  },
  actionBarWrapper: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
});

export default NewsCard;
