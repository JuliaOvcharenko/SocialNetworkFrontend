import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOURS.Plum, 
        paddingVertical: 16,
        borderRadius: 30, 
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: 500,
    }
});