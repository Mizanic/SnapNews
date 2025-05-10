import { FlatList, ActivityIndicator } from "react-native";
import NewsCard from "./NewsCard";

const NewsList = ({ data, loading ,bookmarks, likes}: any) =>{
  return loading ? (
    <ActivityIndicator size="large" color="#ff007f" className="mt-4" />
  ) : (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <NewsCard
          news={item}
          isBookmarked={bookmarks.has(item.item_hash)?true:false}
          isLiked={likes.has(item.item_hash)?true:false}
        />
      )}
      style={{ padding: 16, gap: 10 }}
      keyExtractor={(item) => item.item_hash}
    />
  );
}

export default NewsList;
