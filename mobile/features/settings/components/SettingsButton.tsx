import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push("/settings")}>
      <ThemedView>
        <ThemedText>Settings</ThemedText>
      </ThemedView>
    </Pressable>
  );
}
