import { View, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Header = () => {
  return (
    <LinearGradient
      colors={["#3a7bd5", "#3a6073"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer}
    >
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
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    letterSpacing: 0.5,
  },
  logoBold: {
    fontWeight: "800",
    color: "#fff",
  },
  logoLight: {
    fontWeight: "300",
    color: "#fff",
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  taglineText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

export default Header;