import { StyleSheet } from 'react-native';
import { COLOURS } from '@shared/constants/colours';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 30,
        backgroundColor: COLOURS.Gray,
    },
    
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 10,
        backgroundColor: COLOURS.Green100, 
        borderWidth: 2,
        borderColor: COLOURS.white,
    },
    nickname: {
        fontFamily: 'Wals-Medium',
        fontSize: 14,
        color: COLOURS.darkBlue,
    },
    moreButton: {
        padding: 4,
        marginTop: -20, 
    },
    signature: {
        marginTop: 8,
        width: 120,    
        height: 40,    
        resizeMode: 'contain',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginTop: 12,
    }
});