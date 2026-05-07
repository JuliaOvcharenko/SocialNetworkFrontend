import { StyleSheet } from 'react-native';
import { COLOURS } from '@shared/constants/colours';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        width: 340,
        backgroundColor: COLOURS.white,
        borderRadius: 24,
        paddingVertical: 46,
        paddingHorizontal: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontFamily: 'Wals-Medium',
        fontSize: 24,
        color: COLOURS.darkBlue,
        marginBottom: 32,
        textAlign: 'center',
    },
    description: {
        fontFamily: 'Wals-Regular',
        fontSize: 16,
        color: COLOURS.darkBlue,
        marginBottom: 32,
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        width: '100%',
    },
    primaryOverride: {
        width: 'auto',
        minWidth: 100,
        height: 40,
        paddingHorizontal: 10,
    },
    outlineOverride: {
        width: 'auto',
        minWidth: 100,
        height: 40,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 30,
    },
    textOverride: {
        fontSize: 14,
        fontFamily: 'Wals-Regular',
    }
});