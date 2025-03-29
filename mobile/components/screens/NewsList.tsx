import { FlatList, ActivityIndicator } from "react-native";
import NewsCard from "./NewsCard";

const NewsList = ({ data, loading }: any) =>
  loading ? (
    <ActivityIndicator size="large" color="#ff007f" className="mt-4" />
  ) : (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <NewsCard
          title={item.headline}
          description={item.summary}
          image={item.media.image_url}
          label={item.source}
        />
      )}
      style={{ padding: 16, gap: 10 }}
      keyExtractor={(item) => item.url_hash}
    />
  );

export default NewsList;
