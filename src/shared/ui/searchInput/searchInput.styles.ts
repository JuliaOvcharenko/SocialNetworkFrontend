import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOURS.white,
        borderRadius: 10,
        borderColor: COLOURS.Blue20,
        borderWidth: 1,
        paddingHorizontal: 10,
        height: 40,
        marginVertical: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8,

    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Wals-regular',
        color: COLOURS.darkBlue,
    },
});