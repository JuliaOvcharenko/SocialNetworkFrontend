import { Header } from '@shared/ui/header/header';
import { View } from 'react-native';


export default function MainScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header showSettingsButton showCreateButton showLogoutButton />
        </View>
    )
}