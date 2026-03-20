import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from './index.styles'


export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<'personal' | 'albums'>('personal')

    return (
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('personal')}>

                    <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>
                        Особиста інформація
                    </Text>
                    {activeTab === 'personal' && <View style={styles.indicator}/>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('albums')}>
                    <Text style={[styles.tabText, activeTab === 'albums' && styles.tabTextActive]}>
                        Альбоми
                    </Text>
                    {activeTab === 'albums' && <View style={styles.indicator}/>}
                </TouchableOpacity>
            </View>

            {activeTab === 'personal' && <View style={styles.content}><Text style={{fontFamily: "Wals-Bold"}}>Особиста інформація</Text></View>}
            {activeTab === 'albums' && <View style={styles.content}><Text>Альбоми</Text></View>}
        </View>
    )
}
