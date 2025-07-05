import { View, type ViewProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
    const colors = useThemeColors();
    const backgroundColor = lightColor || darkColor ? lightColor || darkColor : colors.backgroundColors.primary;

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
