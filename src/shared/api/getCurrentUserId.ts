import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCurrentUserId(): Promise<number | null> {
	const token = await AsyncStorage.getItem("token");
	if (!token) return null;
	const decoded = jwtDecode<{ id: number }>(token);
	return decoded.id;
}
