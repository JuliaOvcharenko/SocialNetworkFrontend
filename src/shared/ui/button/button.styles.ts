import { COLOURS } from "../../constants/colours"; 
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    // Стандартна кнопка
    primary: {
        backgroundColor: COLOURS.Plum, 
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30, 
        width: "100%",
    },
    // Світла кнопка з фіолетовим фоном
    secondary: {
        backgroundColor: COLOURS.Plum50, 
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 30, 
        borderWidth: 1.5,
        borderColor: COLOURS.Plum, 
    },
    // як secondary, але біла
    outline: {
        backgroundColor: COLOURS.white, 
        paddingVertical: 10,
        paddingHorizontal: 12, 
        borderRadius: 24, 
        borderWidth: 1, 
        borderColor: COLOURS.Plum,
    },
    iconCircular: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: COLOURS.Plum,
        backgroundColor: 'transparent',
    },
    textPrimary: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500",
    },
    textSecondary: {
        color: COLOURS.Plum,
        fontSize: 14,
        fontWeight: "600",
    },

    textOutline: {
        color: COLOURS.Plum, 
        fontSize: 14,
        fontWeight: "500",
    }
});