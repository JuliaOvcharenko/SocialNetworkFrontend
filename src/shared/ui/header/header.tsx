import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./header.styles";
import { IMAGES } from "../images";
import { HeaderProps } from "./header.types";
import { useRouter } from "expo-router";


const router = useRouter()

export function Header(props: HeaderProps) {
    const {showCreateButton, showSettingsButton, showLogoutButton} = props
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.navigate('core/')}>
                <IMAGES.LogoImage style={{ width: 145, height: 18 }}/>
            </TouchableOpacity>

            <View style={styles.headerButtons}>
                {showCreateButton && (
                    <IMAGES.addPostButton style={{ width: 40, height: 40 }}/>
                )}
                {showSettingsButton && (
                    <TouchableOpacity onPress={() => router.push('core/settings')}>
                        <IMAGES.settingsButton style={{ width: 40, height: 40, marginLeft: 8 }} />
                    </TouchableOpacity>
                )}
                {showLogoutButton && (
                    <TouchableOpacity onPress={() => router.push('core/pp')}>
                        <IMAGES.logoutButton style={{ width: 40, height: 40, marginLeft: 8 }}/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}