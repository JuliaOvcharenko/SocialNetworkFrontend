import { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { styles } from "./input.styles";
import { COLOURS } from "../../constants/colours"; 
import { IMAGES } from "../images";

interface InputProps extends TextInputProps {
    label: string;
    isPassword?: boolean; 
    error?: string;
}

export function Input({ label, isPassword, error, style, ...rest }: InputProps) {
    const [isSecure, setIsSecure] = useState(isPassword);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            
            <View style={[styles.inputWrapper, error ? { borderColor: 'red' } : {}]}>
                <TextInput 
                    style={[styles.input, style]} 
                    placeholderTextColor={COLOURS.Blue50} 
                    secureTextEntry={isSecure}
                    {...rest} 
                />
                
                {isPassword && (
                    <TouchableOpacity 
                        style={styles.iconContainer} 
                        onPress={() => setIsSecure(!isSecure)} 
                    >
                        {isSecure ? (
                            <IMAGES.EyeClose style={{ width: 20, height: 20 }} />
                        ) : (
                            <IMAGES.EyeOpen style={{ width: 20, height: 20 }} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                    {error}
                </Text>
            )}
        </View>
    );
}