import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";
import { Header } from "@shared/ui/header/header";
import { IMAGES } from "../../../shared/ui/images";

export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState<'contacts' | 'messages' | 'groupChats'>('contacts');

    const tabs = [
        {
            key: 'contacts',
            label: 'Контакти',
            icon: <IMAGES.friendsButton style={styles.icon} />,
            badge: 0,
        },
        {
            key: 'messages',
            label: 'Повідомлення',
            icon: <IMAGES.chatButton style={styles.icon} />,
            badge: 0,
        },
        {
            key: 'groupChats',
            label: 'Групові чати',
            icon: <IMAGES.chatButton style={styles.icon} />,
            badge: 0,
        },
    ] as const;

    return (
        <View style={styles.container}>
            <Header showCreateButton showLogoutButton />

            <View style={styles.tabsContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tab}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <View style={styles.iconWrapper}>
                                {tab.icon}
                                {tab.badge > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{tab.badge}</Text>
                                    </View>
                                )}
                            </View>

                            <Text style={[styles.tabTextActive]}>
                                {tab.label}
                            </Text>

                            {isActive && <View style={styles.indicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {activeTab === 'contacts' && (
                <View style={styles.content}>
                    <Text>Контакти</Text>
                </View>
            )}
            {activeTab === 'messages' && (
                <View style={styles.content}>
                    <Text>Повідомлення</Text>
                </View>
            )}
            {activeTab === 'groupChats' && (
                <View style={styles.content}>
                    <Text>Групові чати</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingHorizontal: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        position: 'relative',
        gap: 4,
    },
    iconWrapper: {
        position: 'relative',
    },
    icon: {
        width: 16,
        height: 16,
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
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },

    tabTextActive: {
        color: COLOURS.darkBlue,
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: [{ translateX: -30}], 
        width: 60,
        height: 2,
        backgroundColor: COLOURS.Plum,
    },
        content: {
        flex: 1,
        padding: 16,
    },
});