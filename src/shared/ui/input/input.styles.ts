import { StyleSheet } from "react-native";
import { COLOURS } from "../../constants/colours";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16, 
    },
    label: {
        fontSize: 14, 
        fontWeight: 400,
        marginBottom: 8, 
    },
    inputWrapper: {
        width: "100%", 
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLOURS.Blue20, 
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 48, 
        backgroundColor: COLOURS.white,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLOURS.darkBlue, 
        paddingVertical: 0, 
    },
    iconContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
    },
    errorText: {
        color: COLOURS.Red,
        fontSize: 12, 
        marginTop: 4, 
        marginLeft: 4,
    }
});