import { COLOURS } from "@shared/constants/colours";
import { FONT_SIZE } from "@shared/constants/font-size";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
    },

    footerContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
    },

    footerBlock: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 8,
        gap: 7,
        position: "relative",
    },

    footerText: {
        fontSize: FONT_SIZE.font14,
        color: COLOURS.darkBlue,
        fontFamily: "Wals-Medium",
    },

    activeIndicator: {
        position: "absolute",
        top: -1,
        left: "20%",
        right: "20%",
        height: 2,
        borderRadius: 2,
        backgroundColor: COLOURS.Plum,
    },
});