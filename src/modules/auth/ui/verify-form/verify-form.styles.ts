import { COLOURS } from '@shared/constants/colours';
import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: 343,
        backgroundColor: COLOURS.white,
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 35,
        gap: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    description: {
        paddingTop: 12,
        fontSize: 14,
        lineHeight: 20,
        color: COLOURS.darkBlue,
        textAlign: 'center',
        fontWeight: 500
    },
    email: {
        color: COLOURS.Black,
        fontWeight: '500',
    },

    error: {
        fontSize: 12,
        color: '#E53935',
        marginTop: -8,
    },
    label: {
        paddingTop: 12,
        fontSize: 16,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    submitButton: {
        marginTop: 8,
    },
    backText: {
        fontSize: 15,
        color: '#1A1A1A',
        textAlign: 'center',
        fontWeight: '500',
    },
});