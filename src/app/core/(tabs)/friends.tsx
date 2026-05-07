import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header";
import { FriendCard } from "@modules/friends/ui/components/friend-card/friend-card";
import { FriendActionModal } from "@modules/friends/ui/components/friend-action-modal/friend-action-modal";

const MOCK_USERS = [
    {
        id: '1',
        name: 'Yehor Aung',
        alias: '@thelili',
        avatarUrl: require('../../../assets/Frame1.png'),
        isOnline: false,
    },
    {
        id: '2',
        name: 'Ann Ann',
        alias: '@thelili',
        avatarUrl: require('../../../assets/Frame2.png'),
        isOnline: true,
    },
    {
        id: '3',
        name: 'Max Power',
        alias: '@maxp',
        avatarUrl: require('../../../assets/Frame1.png'),
        isOnline: true,
    },
    {
        id: '4',
        name: 'Sarah Connor',
        alias: '@skynet',
        avatarUrl: require('../../../assets/Frame2.png'),
        isOnline: false,
    },
    {
        id: '5',
        name: 'John Doe',
        alias: '@johny',
        avatarUrl: require('../../../assets/Frame1.png'),
        isOnline: true,
    },
    {
        id: '6',
        name: 'Jane Smith',
        alias: '@jane',
        avatarUrl: require('../../../assets/Frame2.png'),
        isOnline: false,
    }
];

export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState<'main' | 'requests' | 'recommendations' | 'all friends'>('main');
    
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');

    const openModal = (text: string) => {
        setModalText(text);
        setModalVisible(true);
    };

    const handleConfirm = () => {
        setModalVisible(false);
    };

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

            <View style={styles.contentWrapper}>
                {activeTab === 'main' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
                        
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Запити</Text>
                            <TouchableOpacity onPress={() => setActiveTab('requests')}>
                                <Text style={styles.sectionLink}>Дивитись всі</Text>
                            </TouchableOpacity>
                        </View>
                        {MOCK_USERS.slice(0, 2).map((user) => (
                            <FriendCard 
                                key={`main-req-${user.id}`}
                                user={user} 
                                variant="request" 
                                onPrimaryPress={() => {}}
                                onSecondaryPress={() => openModal(`Відхилити запит від ${user.name}?`)}
                            />
                        ))}

                        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                            <Text style={styles.sectionTitle}>Рекомендації</Text>
                            <TouchableOpacity onPress={() => setActiveTab('recommendations')}>
                                <Text style={styles.sectionLink}>Дивитись всі</Text>
                            </TouchableOpacity>
                        </View>
                        {MOCK_USERS.slice(0, 2).map((user) => (
                            <FriendCard 
                                key={`main-rec-${user.id}`}
                                user={user} 
                                variant="recommendation" 
                                onPrimaryPress={() => {}}
                                onSecondaryPress={() => openModal(`Приховати рекомендацію?`)}
                            />
                        ))}

                        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                            <Text style={styles.sectionTitle}>Всі друзі</Text>
                            <TouchableOpacity onPress={() => setActiveTab('all friends')}>
                                <Text style={styles.sectionLink}>Дивитись всі</Text>
                            </TouchableOpacity>
                        </View>
                        {MOCK_USERS.slice(0, 2).map((user) => (
                            <FriendCard 
                                key={`main-fr-${user.id}`}
                                user={user} 
                                variant="friend" 
                                onPrimaryPress={() => {}}
                                onSecondaryPress={() => openModal(`Видалити ${user.alias} з друзів?`)}
                            />
                        ))}
                    </ScrollView>
                )}

                {activeTab === 'requests' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
                        {MOCK_USERS.map((user) => (
                            <FriendCard 
                                key={`req-${user.id}`}
                                user={user} 
                                variant="request" 
                                onPrimaryPress={() => {}}
                                onSecondaryPress={() => openModal(`Відхилити запит від ${user.name}?`)}
                            />
                        ))}
                    </ScrollView>
                )}

                {activeTab === 'recommendations' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
                        {MOCK_USERS.map((user) => (
                            <FriendCard 
                                key={`rec-${user.id}`}
                                user={user} 
                                variant="recommendation" 
                                onPrimaryPress={() => {}}
                                onSecondaryPress={() => openModal(`Приховати рекомендацію?`)}
                            />
                        ))}
                    </ScrollView>
                )}

                {activeTab === 'all friends' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
                        {MOCK_USERS.map((user) => (
                            <FriendCard 
                                key={`fr-${user.id}`}
                                user={user} 
                                variant="friend" 
                                onPrimaryPress={() => {}}
                                onSecondaryPress={() => openModal(`Видалити ${user.alias} з друзів?`)}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>

            <FriendActionModal 
                isVisible={isModalVisible}
                onConfirm={handleConfirm}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF8FF",
    },
    tabsContainer: {
        flexDirection: 'row',
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
        fontFamily: 'Wals-Medium',
    },
    tabTextActive: {
        color: COLOURS.darkBlue,
        fontFamily: 'Wals-Bold',
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
    contentWrapper: {
        flex: 1,
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderWidth: 1,
        borderColor: COLOURS.Gray,
        borderBottomWidth: 0,
        overflow: 'hidden',
    },
    contentScroll: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Wals-Medium',
        fontSize: 16,
        color: COLOURS.Black,
    },
    sectionLink: {
        fontFamily: 'Wals-Medium',
        fontSize: 16,
        color: COLOURS.Plum,
    }
});