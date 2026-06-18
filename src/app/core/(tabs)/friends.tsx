import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header";
import { FriendActionModal } from "@modules/friends/ui/components/friend-action-modal/friend-action-modal";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";

import { useFriendActions } from "@modules/friends/hooks/useFriendActions";
import { MainFriendsTab } from "@modules/friends/ui/components/tabs/MainFriendsTab";
import { RequestsTab } from "@modules/friends/ui/components/tabs/RequestsTab";
import { RecommendationsTab } from "@modules/friends/ui/components/tabs/RecommendationsTab";
import { AllFriendsTab } from "@modules/friends/ui/components/tabs/AllFriendsTab";

export type Tab = "main" | "requests" | "recommendations" | "all friends";

const TAB_LABELS: Record<Tab, string> = {
    main: "Головна",
    requests: "Запити",
    recommendations: "Рекомендації",
    "all friends": "Всі друзі",
};
const TABS: Tab[] = ["main", "requests", "recommendations", "all friends"];

export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState<Tab>("main");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const {
        isModalVisible,
        modalText,
        openModal,
        handleConfirm,
        handleCancel,
        acceptAction,
        deleteAction,
    } = useFriendActions();

    useEffect(() => {
        getCurrentUserId().then((id) => setCurrentUserId(String(id)));
    }, []);

    return (
        <View style={styles.container}>
            <Header showSettingsButton showLogoutButton />

            <View style={styles.tabsContainer}>
                {TABS.map((tab) => (
                    <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {TAB_LABELS[tab]}
                        </Text>
                        {activeTab === tab && <View style={styles.indicator} />}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.contentWrapper}>
                {activeTab === "main" && (
                    <MainFriendsTab
                        currentUserId={currentUserId}
                        setActiveTab={setActiveTab}
                        openModal={openModal}
                        acceptAction={acceptAction}
                        deleteAction={deleteAction}
                    />
                )}
                {activeTab === "requests" && (
                    <RequestsTab 
                        openModal={openModal} 
                        acceptAction={acceptAction} 
                        deleteAction={deleteAction} 
                    />
                )}
                {activeTab === "recommendations" && (
                    <RecommendationsTab 
                        acceptAction={acceptAction} 
                    />
                )}
                {activeTab === "all friends" && (
                    <AllFriendsTab
                        currentUserId={currentUserId}
                        openModal={openModal}
                        deleteAction={deleteAction}
                    />
                )}
            </View>

            <FriendActionModal
                isVisible={isModalVisible}
                description={modalText}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAF8FF" },
    tabsContainer: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 20 },
    tab: { marginRight: 24, paddingVertical: 5, position: "relative" },
    tabText: { fontSize: 14, color: "#9E9E9E", fontFamily: "Wals-Medium" },
    tabTextActive: { color: COLOURS.darkBlue, fontFamily: "Wals-Bold" },
    indicator: { position: "absolute", bottom: -1, left: 0, right: 0, height: 2, backgroundColor: COLOURS.Plum, borderRadius: 1 },
    contentWrapper: {
        flex: 1,
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderWidth: 1,
        borderColor: COLOURS.Gray,
        borderBottomWidth: 0,
        overflow: "hidden",
    },
});