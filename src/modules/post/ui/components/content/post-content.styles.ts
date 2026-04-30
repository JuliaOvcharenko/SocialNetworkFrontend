import { StyleSheet } from 'react-native';
import { COLOURS } from '@shared/constants/colours';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Wals-Medium',
        fontSize: 16,
        color: COLOURS.Black,
        marginBottom: 12,
    },
    text: {
        fontFamily: 'Wals-Regular',
        fontSize: 14,
        color: COLOURS.Black,
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagText: {
        fontFamily: 'Wals-Regular',
        fontSize: 14,
        color: COLOURS.Plum,
        lineHeight: 20,
    }
});