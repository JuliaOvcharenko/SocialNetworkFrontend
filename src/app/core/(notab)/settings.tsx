import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { Footer } from "@shared/ui/footer/footer";
import { useGetMeQuery } from "@modules/auth/api/user-api";

import { PersonalDataTab } from "@modules/settings/ui/components/tabs/PersonalDataTab";

export default function SettingsScreen() {
    const { isLoading: isUserLoading } = useGetMeQuery();
    const [activeTab, setActiveTab] = useState<"personal" | "albums">("personal");
    const Router = useRouter();

    if (isUserLoading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={COLOURS.Plum} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.Plum50 }} edges={["left", "right"]}>
            <View style={styles.container}>
                <Header showSettingsButton showCreateButton showLogoutButton />

                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("personal")}>
                        <Text style={[styles.tabText, activeTab === "personal" && styles.tabTextActive]}>
                            Особиста інформація
                        </Text>
                        {activeTab === "personal" && <View style={styles.indicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => Router.push("/core/albums")}>
                        <Text style={[styles.tabText, activeTab === "albums" && styles.tabTextActive]}>
                            Альбоми
                        </Text>
                        {activeTab === "albums" && <View style={styles.indicator} />}
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                    {activeTab === "personal" && <PersonalDataTab />}
                    {activeTab === "albums" && (
                        <View style={styles.content}>
                            <Text>Тут будуть Альбоми</Text>
                        </View>
                    )}
                </View>
                <Footer />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOURS.Plum50 },
    tabsContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: COLOURS.Plum50,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 6,
    },
    tab: { marginRight: 24, paddingVertical: 5, position: "relative" },
    tabText: { fontSize: 16, color: COLOURS.Gray50 },
    tabTextActive: { color: COLOURS.darkBlue, fontWeight: "700" },
    indicator: { position: "absolute", bottom: -1, left: 0, right: 0, height: 2, backgroundColor: COLOURS.darkBlue, borderRadius: 1 },
    content: { flex: 1, padding: 16 },
});