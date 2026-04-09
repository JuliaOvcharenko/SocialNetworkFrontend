import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, TextStyle, ViewStyle } from "react-native";
import { styles } from "./button.styles";

interface ButtonProps extends TouchableOpacityProps {
    title?: string;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    variant?: 'primary' | 'secondary' | 'outline' | 'iconCircular'; 
}

export function Button({ 
    title, 
    icon, 
    iconPosition = 'left', 
    variant = 'primary', 
    style, 
    textStyle, 
    ...rest 
}: ButtonProps) {
    
    let buttonVariantStyle: StyleProp<ViewStyle> = styles.primary;
    let textVariantStyle: StyleProp<TextStyle> = styles.textPrimary;

    if (variant === 'secondary') {
        buttonVariantStyle = styles.secondary;
        textVariantStyle = styles.textSecondary;
    } else if (variant === 'outline') { 
        buttonVariantStyle = styles.outline;
        textVariantStyle = styles.textOutline;
    } else if (variant === 'iconCircular') {
        buttonVariantStyle = styles.iconCircular;
    }

    return (
        <TouchableOpacity style={[styles.base, buttonVariantStyle, style]} activeOpacity={0.8} {...rest}>
            {icon && iconPosition === 'left' && icon}
            
            {title && (
                <Text style={[
                    textVariantStyle, 
                    textStyle, 
                    (icon && iconPosition === 'left') ? { marginLeft: 8 } : null, 
                    (icon && iconPosition === 'right') ? { marginRight: 8 } : null
                ]}>
                    {title}
                </Text>
            )}

            {icon && iconPosition === 'right' && icon}
        </TouchableOpacity>
    );
}