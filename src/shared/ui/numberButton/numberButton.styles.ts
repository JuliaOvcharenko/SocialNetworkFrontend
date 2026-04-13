import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    pair: {
        flexDirection: 'row',
        gap: 8,
    },
    box: {
        width: 40,
        height: 40,
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 22,
        backgroundColor: '#fff',
        textAlignVertical: 'center',
        paddingTop: 0,
        paddingBottom: 0,
    },
});