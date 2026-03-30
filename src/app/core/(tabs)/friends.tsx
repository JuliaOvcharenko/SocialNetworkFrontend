import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState<'main' | 'requests' | 'recommendations' | 'all friends'>('main')

    return (
        <View style={styles.container}>
            <Header showSettingsButton showLogoutButton />
            
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('main')}>

                    <Text style={[styles.tabText, activeTab === 'main' && styles.tabTextActive]}>
                        Головна
                    </Text>
                    {activeTab === 'main' && <View style={styles.indicator}/>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('requests')}>
                    <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
                        Запити
                    </Text>
                    {activeTab === 'requests' && <View style={styles.indicator}/>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('recommendations')}>
                    <Text style={[styles.tabText, activeTab === 'recommendations' && styles.tabTextActive]}>
                        Рекомендації
                    </Text>
                    {activeTab === 'recommendations' && <View style={styles.indicator}/>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('all friends')}>
                    <Text style={[styles.tabText, activeTab === 'all friends' && styles.tabTextActive]}>
                        Усі друзі
                    </Text>
                    {activeTab === 'all friends' && <View style={styles.indicator}/>}
                </TouchableOpacity>
            </View>

            {activeTab === 'main' && <View style={styles.content}><Text>Особиста інформація</Text></View>}
            {activeTab === 'requests' && <View style={styles.content}><Text>Запити</Text></View>}
            {activeTab === 'recommendations' && <View style={styles.content}><Text>Рекомендації</Text></View>}
            {activeTab === 'all friends' && <View style={styles.content}><Text>Усі друзі</Text></View>}
        </View>
    )
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
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: COLOURS.Plum,
        borderRadius: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
})