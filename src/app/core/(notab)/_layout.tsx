import { Footer } from '@shared/ui/footer';
import { Slot } from 'expo-router';
import { View } from 'react-native';


export default function NoTabLayout() {
    return <View style={{ flex: 1 }}>
                <Slot />
                <Footer/>
            </View>
}