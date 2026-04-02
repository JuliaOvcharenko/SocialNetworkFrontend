import { StyleSheet } from "react-native";
import { COLOURS } from "../../constants/colours";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16, 
    },
    label: {
        fontSize: 16,
        fontWeight: "400",
        color: COLOURS.darkBlue, 
        marginBottom: 8, 
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLOURS.Blue20, 
        borderRadius: 10,
        paddingHorizontal: 16,
        height: 42,
        backgroundColor: COLOURS.white,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLOURS.darkBlue, 
    },
    iconContainer: {
        marginLeft: 10,
    }
});