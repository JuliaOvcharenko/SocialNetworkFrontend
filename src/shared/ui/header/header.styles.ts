import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLOURS.white
    },

    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
});