import { COLOURS } from "@shared/constants/colours";
import { Header } from "@shared/ui/header/header";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GalleryButton } from "@shared/ui/images/_images/buttonIcons/galleryButton";
import { AddPostButton } from "@shared/ui/images/_images/header/add-post-button";
import { Image } from "expo-image";



export default function AlbumsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <Header showSettingsButton showCreateButton showLogoutButton />

                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tab} onPress={() => router.push('/core/settings')}>
                        <Text style={styles.tabText}>Особиста інформація</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={[styles.tabText, styles.tabTextActiveAlbum]}>Альбоми</Text>
                        <View style={styles.indicator} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Мої фото</Text>
                            <TouchableOpacity style={styles.addButton}>
                                <GalleryButton style={styles.addButtonIcon}></GalleryButton>
                                <Text style={styles.addButtonText}>Додати фото</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Image source={require('@assetsIcons/default-avatar.png')} style={{ width: 200, height: 200, borderRadius: 10, marginTop: 13}} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.emptyAlbum}>
                            <Text style={styles.emptyText}>Немає ще жодного альбому</Text>
                            <TouchableOpacity>
                                <AddPostButton style={{ width: 32, height: 32 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
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
    tab: {
        marginRight: 24,
        paddingVertical: 5,
        position: "relative",
    },
    tabText: {
        fontSize: 16,
        color: COLOURS.Gray50,
    },
    tabTextActiveAlbum: {
        fontWeight: "700",
        color: COLOURS.darkBlue,
    },
    indicator: {
        position: "absolute",
        bottom: -1, left: 0, right: 0,
        height: 2,
        backgroundColor: COLOURS.darkBlue,
        borderRadius: 1,
    },
    scrollContent: { paddingBottom: 160, paddingTop: 16 },
    section: {
        backgroundColor: COLOURS.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLOURS.Gray,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: COLOURS.darkBlue,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1.3,
        borderColor: COLOURS.Plum,
        borderRadius: 20,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    addButtonIcon: {
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonIconText: {
        fontSize: 16,
        color: COLOURS.darkBlue,
    },
    addButtonText: {
        fontSize: 14,
        color: COLOURS.Plum,
        fontWeight: "500"
    },
    emptyAlbum: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: COLOURS.darkBlue,
        fontWeight: "500"
    },
    plusButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLOURS.Gray,
        justifyContent: "center",
        alignItems: "center",
    },
    plusText: {
        fontSize: 20,
        color: COLOURS.darkBlue,
        lineHeight: 24,
    },
});