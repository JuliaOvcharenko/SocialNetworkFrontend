import { View, TouchableOpacity } from "react-native";
import { styles } from "./header.styles";
import { IMAGES } from "../images";
import { HeaderProps } from "./header.types";
import { useRouter, usePathname } from "expo-router";
import { Button } from "@shared/ui/button"; 
import { COLOURS } from "@shared/constants/colours";

export function Header(props: HeaderProps) {
    const { showCreateButton, showSettingsButton, showLogoutButton, onCreatePress } = props; 
    
    const router = useRouter();
    const pathname = usePathname(); 

    const isSettingsActive = pathname.includes('settings');

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.navigate('/core')}>
                <IMAGES.LogoImage style={{ width: 145, height: 18 }}/>
            </TouchableOpacity>

            <View style={styles.headerButtons}>
                
                {showCreateButton && (
                    <Button 
                        variant="iconCircular"
                        onPress={onCreatePress} 
                        icon={<IMAGES.AddPostButton style={{ width: 20, height: 20 }}/>}
                    />
                )}
                
                {showSettingsButton && (
                    <Button 
                        variant="iconCircular" 
                        onPress={() => router.push('/core/settings')}
                        style={[
                            { marginLeft: 8 },
                            isSettingsActive && { backgroundColor: COLOURS.Plum50 } 
                        ]}
                        disabled={isSettingsActive}
                        icon={<IMAGES.settingsButton style={{ width: 20, height: 20 }}/>}
                    />
                )}
                
                {showLogoutButton && (
                    <Button 
                        variant="iconCircular"
                        onPress={() => router.replace('/login')}
                        style={{ marginLeft: 8 }}
                        icon={<IMAGES.logoutButton style={{ width: 40, height: 40 }}/>}
                    />
                )}
                
            </View>
        </View>
    );
}