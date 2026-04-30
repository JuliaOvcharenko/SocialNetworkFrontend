import { StyleSheet } from 'react-native';
import { COLOURS } from '@shared/constants/colours';

export const styles = StyleSheet.create({
    container: {
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24, 
        marginBottom: 8,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    actionText: {
        fontFamily: 'Wals-Regular',
        fontSize: 12,
        color: COLOURS.Black,
    }
});