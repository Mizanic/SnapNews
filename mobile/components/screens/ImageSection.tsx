import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ImageSection: React.FC<{ image: string; label: string }> = ({ image, label }) => (
    <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        {label && (
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{label}</Text>
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        aspectRatio: 16 / 9, // Adjusts height automatically based on width
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    labelContainer: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    labelText: {
        color: "white",
        fontSize: 12,
    },
});

export default ImageSection;
