import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import { NewsItem } from "../../model/newsItem";

interface ActionBarProps {
  news: NewsItem;
  isBookmarked : boolean;
}

const ActionBar = ({news,isBookmarked}:ActionBarProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  return (
    <View style={styles.actionBar}>
      <TouchableOpacity onPress={() => handleLike()}>
        <MaterialIcons
          name={isLiked ? "thumb-up-alt" : "thumb-up-off-alt"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>
      <BookmarkButton news={news} isBookmarked={isBookmarked}/>
      <ShareButton newsSourceUrl={news.news_url}/>
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
