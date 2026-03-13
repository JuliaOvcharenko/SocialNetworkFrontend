import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        'Wals-Bold': require('@assetsFonts/GTWalsheimPro-Bold.ttf'),
        'Wals-light': require('@assetsFonts/GTWalsheimPro-Light.ttf'),
        'Wals-Medium': require('@assetsFonts/GTWalsheimPro-Medium.ttf'),
        'Wals-Regular': require('@assetsFonts/GTWalsheimPro-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <SafeAreaProvider>
                <KeyboardProvider>
                    <StatusBar style="light" />
                    <Stack screenOptions={{ headerShown: false }} />
                </KeyboardProvider>
        </SafeAreaProvider>
    );
}