import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customCheckboxFrame: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkIcon: {
        width: 20,
        height: 20,
    },
    checkboxLabel: {
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'Wals-Medium',
        color: '#000',
    }
});