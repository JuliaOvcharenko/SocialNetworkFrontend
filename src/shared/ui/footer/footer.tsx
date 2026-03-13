import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./footer.styles";
import { IMAGES } from "../images";
import { usePathname, useRouter } from "expo-router";

export function Footer() {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={() => router.navigate('/')} style={styles.footerBlock}>
                    {pathname === '/' && <View style={styles.activeIndicator} />}
                    <IMAGES.homeButton style={{ width: 16, height: 16 }} />
                    <Text style={styles.footerText}>Головна</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.navigate('/profile')} style={styles.footerBlock}>
                    {pathname === '/profile' && <View style={styles.activeIndicator} />}
                    <IMAGES.publicationButton style={{ width: 18, height: 18 }} />
                    <Text style={styles.footerText}>Мої публікації</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.navigate('/friends')} style={styles.footerBlock}>
                    {pathname === '/friends' && <View style={styles.activeIndicator} />}
                    <IMAGES.friendsButton style={{ width: 18, height: 14 }} />
                    <Text style={styles.footerText}>Друзі</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.navigate('/chats')} style={styles.footerBlock}>
                    {pathname === '/chats' && <View style={styles.activeIndicator} />}
                    <IMAGES.chatButton style={{ width: 16.5, height: 16 }} />
                    <Text style={styles.footerText}>Чати</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}