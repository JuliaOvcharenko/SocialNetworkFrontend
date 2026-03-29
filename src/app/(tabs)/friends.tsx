import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";
import { Header } from "@shared/ui/header/header";

export default function ChatsScreen() {
    const [activeTab, setActiveTab] = useState<'contacts' | 'messages' | 'groupChats'>('contacts');

    return (
        <View style={styles.container}>
            <Header showCreateButton showLogoutButton />
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('contacts')}>
                    <Text style={[styles.tabText, activeTab === 'contacts' && styles.tabTextActive]}>
                        Контакти
                    </Text>
                    {activeTab === 'contacts' && <View style={styles.indicator} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('messages')}>
                    <Text style={[styles.tabText, activeTab === 'messages' && styles.tabTextActive]}>
                        Повідомлення
                    </Text>
                    {activeTab === 'messages' && <View style={styles.indicator} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('groupChats')}>
                    <Text style={[styles.tabText, activeTab === 'groupChats' && styles.tabTextActive]}>
                        Групові чати
                    </Text>
                    {activeTab === 'groupChats' && <View style={styles.indicator} />}
                </TouchableOpacity>
            </View>

            {activeTab === 'contacts' && <View style={styles.content}><Text>Контакти</Text></View>}
            {activeTab === 'messages' && <View style={styles.content}><Text>Повідомлення</Text></View>}
            {activeTab === 'groupChats' && <View style={styles.content}><Text>Групові чати</Text></View>}
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
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    tab: {
        marginRight: 24,
        paddingVertical: 5,
        position: 'relative',
    },
    tabText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    tabTextActive: {
        color: COLOURS.darkBlue,
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        top: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: COLOURS.darkBlue,
        borderRadius: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
});