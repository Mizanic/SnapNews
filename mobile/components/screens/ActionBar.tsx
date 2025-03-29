import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const ActionBar = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
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
      <TouchableOpacity onPress={() => handleDislike()}>
        <MaterialIcons
          name={isDisliked ? "thumb-down-alt" : "thumb-down-off-alt"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
        <MaterialIcons
          name={isFavorite ? "favorite" : "favorite-outline"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialIcons name="share" size={24} color="#555" />
      </TouchableOpacity>
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
