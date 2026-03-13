import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@shared/ui/header/header';
import { Footer } from '@shared/ui/footer/footer';


export default function ChatsLayout() {
    return (
        <SafeAreaView edges={["top"]} style={{flex: 1 }}>
            <Header showCreateButton showLogoutButton/>
            <View style={{flex: 1 }}>
                <Slot/>
            </View>
            <Footer/>
        </SafeAreaView>
    );
}
