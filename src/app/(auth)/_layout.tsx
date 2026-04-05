import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthHeader } from "@modules/auth/ui/header";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthLayout() {
	
	return (
		<SafeAreaProvider>
			<View style={{flex: 1 }}>
				<Stack screenOptions={{header: AuthHeader, animation: 'none' }}>
					<Stack.Screen name="register"/>
					<Stack.Screen name="login"/>
				</Stack>
			</View>
		</SafeAreaProvider>
	)
}