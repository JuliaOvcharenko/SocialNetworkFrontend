import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { styles } from "./button.styles";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export function Button({ title, style, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.8} {...rest}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}