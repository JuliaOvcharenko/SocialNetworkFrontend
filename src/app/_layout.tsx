import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { baseApi } from "@shared/api/baseApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        "Wals-Bold": require("@assetsFonts/GTWalsheimPro-Bold.ttf"),
        "Wals-light": require("@assetsFonts/GTWalsheimPro-Light.ttf"),
        "Wals-Medium": require("@assetsFonts/GTWalsheimPro-Medium.ttf"),
        "Wals-Regular": require("@assetsFonts/GTWalsheimPro-Regular.ttf"),
    });
    const [tokenChecked, setTokenChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                router.replace("/core");
            }
            setTokenChecked(true);
        };

        if (loaded) {
            SplashScreen.hideAsync();
            checkToken();
        }
    }, [loaded]);

    if (!loaded || !tokenChecked) return null;

    return (
        <ApiProvider api={baseApi}>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                    <StatusBar style="dark" />
                    <Stack screenOptions={{ headerShown: false, animation: "none" }} />
                </SafeAreaView>
            </SafeAreaProvider>
        </ApiProvider>
    );
}