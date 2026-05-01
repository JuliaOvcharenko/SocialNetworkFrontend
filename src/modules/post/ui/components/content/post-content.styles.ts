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
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    tagText: {
        fontFamily: 'Wals-Regular',
        fontSize: 14,
        color: COLOURS.Plum,
        lineHeight: 20,
    },
    linksContainer: {
        marginTop: 8,
        gap: 4,
    },
    linkText: {
        fontFamily: 'Wals-Regular',
        fontSize: 13,
        color: COLOURS.Plum,
        lineHeight: 18,
        textDecorationLine: 'underline',
    },
});