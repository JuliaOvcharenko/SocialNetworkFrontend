import AsyncStorage from "@react-native-async-storage/async-storage";

export const queryBaseHeaders = async (headers: Headers) => {
	const token = await AsyncStorage.getItem("token");
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	return headers;
};