import { Stack } from 'expo-router';
import { View } from 'react-native';


export default function CoreLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
        </View>
    );
}