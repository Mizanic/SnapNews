import React from "react";

export type ScrollDirection = "up" | "down" | "idle";

export interface UseScrollDirectionReturn {
    scrollDirection: ScrollDirection;
    isHeaderVisible: boolean;
    onScroll: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
}

export const useScrollDirection = (threshold: number = 5): UseScrollDirectionReturn => {
    const [scrollDirection, setScrollDirection] = React.useState<ScrollDirection>("idle");
    const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);
    const accumulatedScrollDelta = React.useRef(0);

    const onScroll = React.useCallback(
        (event: { nativeEvent: { contentOffset: { y: number } } }) => {
            const currentScrollY = event.nativeEvent.contentOffset.y;
            const deltaY = currentScrollY - lastScrollY.current;

            // Don't hide header when at the top
            if (currentScrollY <= 0) {
                setScrollDirection("idle");
                setIsHeaderVisible(true);
                accumulatedScrollDelta.current = 0;
                lastScrollY.current = currentScrollY;
                return;
            }

            // Accumulate scroll delta to avoid jittery behavior
            accumulatedScrollDelta.current += deltaY;

            // Only change direction if we've scrolled past the threshold
            if (Math.abs(accumulatedScrollDelta.current) > threshold) {
                const newDirection: ScrollDirection = accumulatedScrollDelta.current > 0 ? "down" : "up";

                if (newDirection !== scrollDirection) {
                    setScrollDirection(newDirection);
                    setIsHeaderVisible(newDirection === "up" || currentScrollY <= 0);
                }

                accumulatedScrollDelta.current = 0;
            }

            lastScrollY.current = currentScrollY;
        },
        [threshold, scrollDirection]
    );

    return {
        scrollDirection,
        isHeaderVisible,
        onScroll,
    };
};
