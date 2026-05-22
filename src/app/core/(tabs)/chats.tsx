import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { IMAGES } from "../../../shared/ui/images";

import { SelectUsersModal } from "@shared/ui/modals/select-users-modal";
import { GroupDetailsModal, GroupDetailsData } from "@shared/ui/modals/group-details-modal";

import { useGetAllFriendsQuery } from "@modules/friends/api/friend.api";
import { getCurrentUserId } from "@shared/api/getCurrentUserId";
import { IUser } from "@modules/friends/api/friend.types";


export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState<'contacts' | 'messages' | 'groupChats'>('contacts');

    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        getCurrentUserId().then(id => setCurrentUserId(id));
    }, []);

    const { data: friendsResponse, isLoading } = useGetAllFriendsQuery();

    const friendsList: IUser[] = useMemo(() => {
        if (!friendsResponse || !currentUserId) return [];

        return friendsResponse.map(friendship => {
            const isMeFrom = friendship.from_profile === currentUserId;
            const friendProfile = isMeFrom ? friendship.toProfileRel : friendship.fromProfileRel;

            return {
                id: friendProfile?.id || 0,
                name: friendProfile?.name || "Невідомий",
                surname: friendProfile?.surname || "",
                nickname: friendProfile?.nickname || "",
                avatars: friendProfile?.avatars || [],
                isOnline: friendProfile?.isOnline || false,
            };
        }).filter(user => user.id !== 0);
    }, [friendsResponse, currentUserId]);

    const tabs = [
        { key: 'contacts', label: 'Контакти', icon: <IMAGES.friendsButton style={styles.iconContacts} />, badge: 0 },
        { key: 'messages', label: 'Повідомлення', icon: <IMAGES.chatButton style={styles.icon} />, badge: 0 },
        { key: 'groupChats', label: 'Групові чати', icon: <IMAGES.chatButton style={styles.icon} />, badge: 0 },
    ] as const;

    const handleSelectSave = (ids: number[]) => {
        setSelectedUserIds(ids);
        setIsSelectModalOpen(false);
        setIsDetailsModalOpen(true);
    };

    const handleRemoveUser = (idToRemove: number) => {
        setSelectedUserIds(prev => prev.filter(id => id !== idToRemove));
    };

    const handleAddMore = () => {
        setIsDetailsModalOpen(false);
        setIsSelectModalOpen(true);
    };

    const handleCreateGroup = (data: GroupDetailsData) => {
        setIsDetailsModalOpen(false);
        setSelectedUserIds([]);
    };

    const selectedUsersData = friendsList.filter(user => selectedUserIds.includes(user.id));

    return (
        <View style={styles.container}>
            <Header
                showCreateButton
                showLogoutButton
                onCreatePress={() => setIsSelectModalOpen(true)}
            />

            <View style={styles.tabsContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => setActiveTab(tab.key)}>
                            <View style={styles.iconWrapper}>
                                {tab.icon}
                                {tab.badge > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{tab.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.tabTextActive}>{tab.label}</Text>
                            {isActive && <View style={styles.indicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {isLoading && activeTab === 'contacts' ? (
                <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={COLOURS.Plum} />
                </View>
            ) : (
                <View style={styles.content}>
                    {activeTab === 'contacts' && <Text>Контакти</Text>}
                    {activeTab === 'messages' && <Text>Повідомлення</Text>}
                    {activeTab === 'groupChats' && <Text>Групові чати</Text>}
                </View>
            )}

            <SelectUsersModal
                visible={isSelectModalOpen}
                onClose={() => setIsSelectModalOpen(false)}
                users={friendsList}
                onSave={handleSelectSave}
                title="Нова група"
                buttonText="Далі"
            />

            <GroupDetailsModal
                visible={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                selectedUsers={selectedUsersData}
                onRemoveUser={handleRemoveUser}
                onAddMore={handleAddMore}
                onSubmit={handleCreateGroup}
                title="Нова група"
                buttonText="Створити групу"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingHorizontal: 8
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        position: 'relative',
        gap: 4
    },
    iconWrapper: {
        position: 'relative'
    },
    icon: {
        width: 16,
        height: 16
    },
    iconContacts: {
        width: 22,
        height: 16
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: COLOURS.Plum,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600'
    },
    tabTextActive: {
        color: COLOURS.darkBlue,
        fontWeight: '600'
    },
    indicator: {
        position: 'absolute',
        top: 0, left: '50%',
        transform: [{ translateX: -30 }],
        width: 60,
        height: 2,
        backgroundColor: COLOURS.Plum
    },
    content: {
        flex: 1,
        padding: 16
    },
});