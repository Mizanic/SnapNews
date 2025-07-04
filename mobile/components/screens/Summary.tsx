import { Text, StyleSheet } from "react-native";
import { Typography } from "../../constants/Fonts";

const Summary = ({ description }: any) => (
  <Text style={styles.summary}>{description}</Text>
);

const styles = StyleSheet.create({
  summary: {
    ...Typography.body,
    color: "#333",
  },
});

export default Summary;
