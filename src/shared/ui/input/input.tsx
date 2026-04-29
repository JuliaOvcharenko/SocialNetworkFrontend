import { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity, DimensionValue } from "react-native";
import { styles } from "./input.styles";
import { COLOURS } from "../../constants/colours"; 
import { IMAGES } from "../images";

interface InputProps extends TextInputProps {
    label?: string;
    isPassword?: boolean; 
    error?: string;
    width?: DimensionValue; 
}

export function Input({ 
    label, 
    isPassword, 
    error, 
    style, 
    editable = true, 
    width = "100%", 
    ...rest 
}: InputProps) {
    const [isSecure, setIsSecure] = useState(isPassword);
    

    const labelColor = !editable ? COLOURS.Gray : COLOURS.darkBlue;

    return (
        <View style={[styles.container, { width }]}>
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            
            <View style={[
                styles.inputWrapper, 
                error ? { borderColor: COLOURS.Red || '#FF4D4D' } : {},
                !editable ? { borderColor: COLOURS.Gray } : {}
            ]}>
                <TextInput 
                    style={[styles.input, style, !editable && { color: COLOURS.Gray }]} 
                    placeholderTextColor={COLOURS.Gray} 
                    secureTextEntry={isSecure}
                    editable={editable}
                    textAlignVertical="center"
                    {...rest} 
                />
                
                {isPassword && (
                    <TouchableOpacity 
                        style={styles.iconContainer} 
                        onPress={() => setIsSecure(!isSecure)}
                        disabled={!editable} 
                        activeOpacity={0.7}
                    >
                        {isSecure ? (
                            <IMAGES.EyeClose style={[styles.icon, !editable && { opacity: 0.4 }]} />
                        ) : (
                            <IMAGES.EyeOpen style={[styles.icon, !editable && { opacity: 0.4 }]} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
}