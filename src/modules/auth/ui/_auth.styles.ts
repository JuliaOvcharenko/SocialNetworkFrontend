import { StyleSheet } from 'react-native';
import { COLOURS } from '../../../shared/constants/colours';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOURS.Plum50,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: COLOURS.white,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 40,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        gap: 20, 
        marginBottom: 30,
    },
    tab: {
        paddingBottom: 8, 
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLOURS.Plum,
    },
    tabText: {
        fontSize: 24,
        fontWeight: '500',
        color: COLOURS.Blue50,
    },
    activeTabText: {
        color: COLOURS.darkBlue,
        fontWeight: '700',
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        color: COLOURS.darkBlue,
        marginBottom: 24,
        textAlign: 'center',
    },
});