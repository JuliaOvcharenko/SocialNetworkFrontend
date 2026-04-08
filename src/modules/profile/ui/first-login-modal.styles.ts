import { StyleSheet } from 'react-native';
import { COLOURS } from '../../../shared/constants/colours'; 

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    keyboardWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    card: {
        backgroundColor: COLOURS.white,
        borderRadius: 24,
        padding: 16,
        width: '100%',
        maxWidth: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 16,
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 500,
        color: COLOURS.darkBlue,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: -20,
        padding: 5,
    },
    closeText: {
        fontSize: 16,
        color: COLOURS.Black,
        fontWeight: 'bold',
    },
    hintText: {
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: -0.1,
        color: COLOURS.darkBlue,
        marginTop: -8,
        marginBottom: 24,
    },
    hintTextGreen: {
        color: COLOURS.Green100, 
    },
   
    submitButton: {
        width: 'auto',         
        alignSelf: 'flex-end', 

        paddingHorizontal: 24, 
        paddingVertical: 12,  
        marginBottom: 16,
    },
});