import { Text, StyleSheet } from "react-native";
import { Typography } from "@/constants/Fonts";

const Header: React.FC<{ title: string }> = ({ title }) => <Text style={styles.title}>{title}</Text>;

const styles = StyleSheet.create({
    title: {
        ...Typography.h2,
        color: "#fff",
    },
});

export default Header;
