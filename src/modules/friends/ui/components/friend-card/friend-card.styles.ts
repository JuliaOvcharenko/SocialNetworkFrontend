import { StyleSheet } from "react-native";
import { COLOURS } from "@shared/constants/colours";

export const styles = StyleSheet.create({
	card: {
		backgroundColor: COLOURS.white,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLOURS.Gray,
		padding: 20,
		alignItems: "center",
		marginBottom: 12,
	},
	avatarContainer: {
		position: "relative",
		marginBottom: 20,
	},
	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: "#EAEAEA",
	},
	indicator: {
		position: "absolute",
		bottom: 0,
		right: 4,
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: COLOURS.Gray,
		borderWidth: 3,
		borderColor: COLOURS.white,
	},
	online: {
		backgroundColor: COLOURS.Green100,
	},
	name: {
		fontFamily: "Wals-Bold",
		fontSize: 24,
		color: COLOURS.darkBlue,
		marginBottom: 10,
	},
	alias: {
		fontFamily: "Wals-Medium",
		fontSize: 16,
		color: COLOURS.darkBlue,
	},
	buttonsRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 12,
		marginTop: 16,
		width: "100%",
	},
	btnContainer: {
		flex: 0.4,
	},
	fullWidthBtn: {
		height: 40,
		paddingVertical: 0,
		paddingHorizontal: 8,
	},
	btnText: {
		fontFamily: "Wals-light",
		fontSize: 15,
	},
});
