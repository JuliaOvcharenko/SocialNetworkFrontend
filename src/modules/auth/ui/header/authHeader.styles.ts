import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		backgroundColor: COLOURS.white,
        height: 55,
		paddingHorizontal: 16,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000000,
        paddingVertical: 8,
	}
})