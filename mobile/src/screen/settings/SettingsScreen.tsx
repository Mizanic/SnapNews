import { useSettingsStore } from "@/lib/state/settingStore";
import { View, Switch, StyleSheet, Pressable, Text, ScrollView, Modal, FlatList, TouchableOpacity, Alert } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, BorderRadius } from "@/styles";
import { Theme, COUNTRIES, LANGUAGES, Country, Language } from "@/lib/types/settingsTypes";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Localization from "expo-localization";

export default function SettingsScreen() {
    const { theme, hapticFeedback, country, language, setTheme, setHapticFeedback, setCountry, setLanguage, forceDetectLocale } =
        useSettingsStore();
    const colors = useThemeColors();

    const [showCountryModal, setShowCountryModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const themeOptions: { label: string; value: Theme }[] = [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "System", value: "system" },
    ];

    const handleThemeChange = (newTheme: Theme) => {
        // Trigger haptic feedback if enabled
        if (hapticFeedback === "enabled") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setTheme(newTheme);
    };

    const handleHapticFeedbackChange = (value: boolean) => {
        // Always trigger feedback when turning ON, but not when turning OFF
        if (value) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setHapticFeedback(value ? "enabled" : "disabled");
    };

    const handleDetectLocale = () => {
        if (hapticFeedback === "enabled") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        forceDetectLocale();
    };

    const showDebugData = () => {
        try {
            const locales = Localization.getLocales();
            const calendars = Localization.getCalendars();
            const region = Localization.getLocales()[0].regionCode;
            const timezone = calendars[0]?.timeZone;

            const debugInfo = {
                region: region,
                timezone: timezone,
                locales: locales.map((locale) => ({
                    languageCode: locale.languageCode,
                    regionCode: locale.regionCode,
                    languageTag: locale.languageTag,
                    textDirection: locale.textDirection,
                    digitGroupingSeparator: locale.digitGroupingSeparator,
                    decimalSeparator: locale.decimalSeparator,
                    measurementSystem: locale.measurementSystem,
                    currencyCode: locale.currencyCode,
                    currencySymbol: locale.currencySymbol,
                })),
                calendars: calendars,
                primaryLocale: locales[0],
            };

            Alert.alert("Locale Debug Info", JSON.stringify(debugInfo, null, 2), [{ text: "OK" }], { cancelable: true });
        } catch (error) {
            Alert.alert("Debug Error", `Failed to get locale info: ${error}`);
        }
    };

    const renderCountryItem = ({ item }: { item: Country }) => (
        <TouchableOpacity
            style={[
                styles.modalItem,
                {
                    backgroundColor: item.code === country.code ? colors.palette.brand[500] : colors.surface.base,
                    borderBottomColor: colors.border.subtle,
                },
            ]}
            onPress={() => {
                if (hapticFeedback === "enabled") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setCountry(item);
                setShowCountryModal(false);
            }}
        >
            <Text style={[styles.flag, { marginRight: Spacing.sm }]}>{item.flag}</Text>
            <Text
                style={[
                    styles.modalItemText,
                    {
                        color: colors.content.primary,
                        fontWeight: item.code === country.code ? "600" : "400",
                    },
                ]}
            >
                {item.name}
            </Text>
            {item.code === country.code && (
                <Ionicons name="checkmark" size={20} color={colors.palette.brand[600]} style={{ marginLeft: "auto" }} />
            )}
        </TouchableOpacity>
    );

    const renderLanguageItem = ({ item }: { item: Language }) => (
        <TouchableOpacity
            style={[
                styles.modalItem,
                {
                    backgroundColor: item.code === language.code ? colors.palette.brand[500] : colors.surface.base,
                    borderBottomColor: colors.border.subtle,
                },
            ]}
            onPress={() => {
                if (hapticFeedback === "enabled") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setLanguage(item);
                setShowLanguageModal(false);
            }}
        >
            <View style={{ flex: 1 }}>
                <Text
                    style={[
                        styles.modalItemText,
                        {
                            color: colors.content.primary,
                            fontWeight: item.code === language.code ? "600" : "400",
                        },
                    ]}
                >
                    {item.name}
                </Text>
                <Text style={[styles.modalItemSubtext, { color: colors.content.secondary }]}>{item.nativeName}</Text>
            </View>
            {item.code === language.code && <Ionicons name="checkmark" size={20} color={colors.palette.brand[600]} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[{ flex: 1 }, { backgroundColor: colors.surface.base }]}>
            <View style={styles.container}>
                {/* Theme Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Theme</Text>
                    <View style={[styles.segmentedControl, { backgroundColor: colors.surface.muted }]}>
                        {themeOptions.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[
                                    styles.segment,
                                    {
                                        backgroundColor: theme === option.value ? colors.palette.brand[500] : "transparent",
                                    },
                                ]}
                                onPress={() => handleThemeChange(option.value)}
                            >
                                <Text
                                    style={{
                                        color: theme === option.value ? colors.white : colors.content.primary,
                                    }}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Haptic Feedback Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Haptic Feedback</Text>
                    <Switch value={hapticFeedback === "enabled"} onValueChange={(value) => handleHapticFeedbackChange(value)} />
                </View>

                {/* Country Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Country</Text>
                    <Pressable
                        style={[
                            styles.selector,
                            {
                                backgroundColor: colors.surface.muted,
                                borderColor: colors.border.default,
                            },
                        ]}
                        onPress={() => setShowCountryModal(true)}
                    >
                        <Text style={[styles.flag, { marginRight: Spacing.sm }]}>{country.flag}</Text>
                        <Text style={[styles.selectorText, { color: colors.content.primary }]}>{country.name}</Text>
                        <Ionicons name="chevron-down" size={20} color={colors.content.secondary} />
                    </Pressable>
                </View>

                {/* Language Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Language</Text>
                    <Pressable
                        style={[
                            styles.selector,
                            {
                                backgroundColor: colors.surface.muted,
                                borderColor: colors.border.default,
                            },
                        ]}
                        onPress={() => setShowLanguageModal(true)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.selectorText, { color: colors.content.primary }]}>{language.name}</Text>
                            <Text style={[styles.selectorSubtext, { color: colors.content.secondary }]}>{language.nativeName}</Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={colors.content.secondary} />
                    </Pressable>
                </View>

                {/* Locale Detection Info */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Locale Detection</Text>
                    <Pressable
                        style={[
                            styles.selector,
                            {
                                backgroundColor: colors.surface.muted,
                                borderColor: colors.border.default,
                            },
                        ]}
                        onPress={handleDetectLocale}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.selectorText, { color: colors.content.primary }]}>Auto-detect from device</Text>
                            <Text style={[styles.selectorSubtext, { color: colors.content.secondary }]}>
                                Tap to re-detect country & language
                            </Text>
                        </View>
                        <Ionicons name="refresh" size={20} color={colors.content.secondary} />
                    </Pressable>
                </View>

                {/* Debug Info Button */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Debug Locale Info</Text>
                    <Pressable
                        style={[
                            styles.selector,
                            {
                                backgroundColor: colors.surface.muted,
                                borderColor: colors.border.default,
                            },
                        ]}
                        onPress={showDebugData}
                    >
                        <Text style={[styles.selectorText, { color: colors.content.primary }]}>Show Raw Locale Data</Text>
                        <Ionicons name="bug" size={20} color={colors.content.secondary} />
                    </Pressable>
                </View>

                {/* Country Selection Modal */}
                <Modal visible={showCountryModal} animationType="slide" presentationStyle="pageSheet">
                    <View style={[styles.modalContainer, { backgroundColor: colors.surface.base }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border.subtle }]}>
                            <Text style={[styles.modalTitle, { color: colors.content.primary }]}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                                <Ionicons name="close" size={24} color={colors.content.primary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList data={COUNTRIES} renderItem={renderCountryItem} keyExtractor={(item) => item.code} style={{ flex: 1 }} />
                    </View>
                </Modal>

                {/* Language Selection Modal */}
                <Modal visible={showLanguageModal} animationType="slide" presentationStyle="pageSheet">
                    <View style={[styles.modalContainer, { backgroundColor: colors.surface.base }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border.subtle }]}>
                            <Text style={[styles.modalTitle, { color: colors.content.primary }]}>Select Language</Text>
                            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                                <Ionicons name="close" size={24} color={colors.content.primary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList data={LANGUAGES} renderItem={renderLanguageItem} keyExtractor={(item) => item.code} style={{ flex: 1 }} />
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
    },
    settingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: 16,
        flex: 1,
    },
    segmentedControl: {
        flexDirection: "row",
        borderRadius: BorderRadius.md,
        overflow: "hidden",
    },
    segment: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    selector: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        minWidth: 200,
    },
    selectorText: {
        fontSize: 16,
        fontWeight: "500",
    },
    selectorSubtext: {
        fontSize: 14,
        marginTop: 2,
    },
    flag: {
        fontSize: 20,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: Spacing.lg,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: Spacing.lg,
        borderBottomWidth: 1,
    },
    modalItemText: {
        fontSize: 16,
        fontWeight: "500",
    },
    modalItemSubtext: {
        fontSize: 14,
        marginTop: 2,
    },
});
