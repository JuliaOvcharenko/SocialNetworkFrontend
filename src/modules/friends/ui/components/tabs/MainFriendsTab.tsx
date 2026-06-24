import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { FriendCard } from "@modules/friends/ui/components/friend-card/friend-card";
import { useGetOverviewQuery } from "@modules/friends/api/friend.api";
import { getUserFromRequest, getUserFromFriend } from "@modules/friends/lib/friend.utils";
import { Tab } from "../../../../../app/core/(tabs)/friends";

type Props = {
    currentUserId: string | null;
    setActiveTab: (tab: Tab) => void;
    openModal: (text: string, action: () => void) => void;
    acceptAction: any;
    deleteAction: any;
};

export function MainFriendsTab({ currentUserId, setActiveTab, openModal, acceptAction, deleteAction }: Props) {
    const { data: overview, isLoading } = useGetOverviewQuery();
    const [hiddenSuggestions, setHiddenSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (overview?.suggestions) setHiddenSuggestions([]);
    }, [overview?.suggestions]);

    const handleAcceptSuggestion = async (id: string) => {
        try {
            await acceptAction({ id: Number(id) }).unwrap();
        } catch (e) {
            console.error(e);
        }
    };

    const renderSectionHeader = (title: string, tab: Tab) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setActiveTab(tab)}>
                <Text style={styles.sectionLink}>Дивитись всі</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) return <ActivityIndicator style={styles.loader} color={COLOURS.Plum} />;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
            {/* СЕКЦІЯ ЗАПИТІВ */}
            {renderSectionHeader("Запити", "requests")}
            {overview?.requests.slice(0, 2).map((item) => {
                const user = getUserFromRequest(item);
                if (!user) return null;
                return (
                    <FriendCard
                        key={`main-req-${item.id}`}
                        user={user}
                        variant="request"
                        onPrimaryPress={() => acceptAction({ id: Number(item.id) })}
                        onSecondaryPress={() =>
                            openModal("Відхилити запит?", () =>
                                deleteAction({ id: Number(item.id), type: "request" })
                            )
                        }
                    />
                );
            })}


            <View style={{ marginTop: 24 }}>
                {renderSectionHeader("Рекомендації", "recommendations")}
            </View>
            {overview?.suggestions
                .filter((user) => !hiddenSuggestions.includes(user.id))
                .slice(0, 2)
                .map((user) => (
                    <FriendCard
                        key={`main-rec-${user.id}`}
                        user={user}
                        variant="recommendation"
                        onPrimaryPress={() => handleAcceptSuggestion(user.id)}
                        onSecondaryPress={() => setHiddenSuggestions((prev) => [...prev, user.id])}
                    />
                ))}


            <View style={{ marginTop: 24 }}>
                {renderSectionHeader("Всі друзі", "all friends")}
            </View>
            {overview?.friends.slice(0, 2).map((item) => {
                const user = getUserFromFriend(item, currentUserId);
                if (!user) return null;
                return (
                    <FriendCard
                        key={`main-fr-${item.id}`}
                        user={user}
                        variant="friend"
                        onPrimaryPress={() => {}}
                        onSecondaryPress={() =>
                            openModal("Видалити з друзів?", () =>
                                deleteAction({ id: Number(item.id) })
                            )
                        }
                    />
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loader: { marginTop: 32 },
    contentScroll: { padding: 16, paddingBottom: 100 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    sectionTitle: { fontFamily: "Wals-Medium", fontSize: 16, color: COLOURS.Black },
    sectionLink: { fontFamily: "Wals-Medium", fontSize: 16, color: COLOURS.Plum },
});