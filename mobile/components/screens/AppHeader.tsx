import { View, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/constants/Fonts";

const Header: React.FC = () => {
    return (
        <LinearGradient colors={["#2c3e50", "#34495e"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerContainer}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    <Text style={styles.logoBold}>Snap</Text>
                    <Text style={styles.logoLight}>News</Text>
                </Text>
            </View>

            <View style={styles.taglineContainer}>
                <Text style={styles.taglineText}>Stay Informed. Stay Ahead.</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        ...Typography.h2,
        color: "#fff",
    },
    logoBold: {
        fontFamily: "Lora-Bold",
    },
    logoLight: {
        fontFamily: "Lora-Regular",
    },
    taglineContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    taglineText: {
        ...Typography.caption,
        color: "rgba(255, 255, 255, 0.9)",
    },
});

export default Header;
