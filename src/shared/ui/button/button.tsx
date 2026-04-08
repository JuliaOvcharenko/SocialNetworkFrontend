import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, TextStyle } from "react-native";
import { styles } from "./button.styles";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({ title, style, textStyle, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.8} {...rest}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}