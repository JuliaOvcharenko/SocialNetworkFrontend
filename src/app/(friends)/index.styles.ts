import { COLOURS } from "@shared/constants/colours";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    tab: {
        marginRight: 24,
        paddingVertical: 5,
        position: 'relative',
    },
    tabText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    tabTextActive: {
        color: COLOURS.darkBlue,
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: COLOURS.darkBlue,
        borderRadius: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
})