// import { View } from "react-native";
// import ImageSection from "./ImageSection";
// import Header from "./Header";
// import Summary from "./Summary";
// const NewsCard = ({ title, description, image, label }: any) => (
//   <View
//     className="bg-white dark:bg-gray-800 rounded-2xl shadow mb-4"
//     style={{ display: "flex", flexDirection: "column", gap: "10px" }}
//   >
//     <ImageSection image={image} label={label} />
//     <View className="p-4">
//       <Header title={title} />
//       <Summary description={description} />
//     </View>
//   </View>
// );

// export default NewsCard;
import { View, StyleSheet } from "react-native";
import ImageSection from "./ImageSection";
import Header from "./Header";
import Summary from "./Summary";
import ActionBar from "./ActionBar";

const NewsCard = ({ title, description, image, label }: any) => (
  <View style={styles.card}>
    <ImageSection image={image} label={label} />
    <View style={styles.content}>
      <Header title={title} />
      <Summary description={description} />
    </View>
    <ActionBar />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden", // To clip the rounded corners
    marginBottom: 12,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  content: {
    padding: 16,
  },
});

export default NewsCard;
