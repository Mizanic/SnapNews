import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useDrawer } from "@/contexts/DrawerContext";

const SwipeToOpenDrawer: React.FC = () => {
    const { width, height } = useWindowDimensions();
    const { openDrawer, isOpen } = useDrawer();

    const pan = Gesture.Pan()
        .minDistance(10)
        .activeOffsetX(15)
        .onEnd((event) => {
            // Open drawer on right swipe from top-left quadrant
            if (!isOpen && event.translationX > 30 && Math.abs(event.translationY) < 100) {
                runOnJS(openDrawer)();
            }
        });

    // Cover the top-left quadrant for swipe detection
    const swipeArea = {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: Math.round(width / 2),
        height: Math.round(height / 2),
        backgroundColor: "transparent",
        zIndex: 1000,
    };

    return (
        <GestureDetector gesture={pan}>
            <View style={swipeArea} pointerEvents="box-only" />
        </GestureDetector>
    );
};

export default SwipeToOpenDrawer;
