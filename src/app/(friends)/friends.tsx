import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from './index.styles'


export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState<'main' | 'requests' | 'recommendations' | 'all friends'>('main')

    return (
        <View style={styles.container}>
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
