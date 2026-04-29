import { StyleSheet } from 'react-native';
import { COLOURS } from '@shared/constants/colours';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: COLOURS.darkBlue, 
        fontFamily: 'Wals-Regular',
    },
    input: {
        borderWidth: 1,
        borderColor: COLOURS.Blue20, 
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        minHeight: 100, 
        backgroundColor: COLOURS.white,
        fontFamily: 'Wals-Regular',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});