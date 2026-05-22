import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./custom-checkbox-row.styles";
import { IMAGES } from "../images";


interface CheckboxProps {
    isSelected: boolean;
    label?: string; 
    onPress: () => void;
    isEditing?: boolean; 
}

export function CustomCheckboxRow({ 
    isSelected, 
    label, 
    onPress, 
    isEditing = true 
}: CheckboxProps) {
    return (
        <TouchableOpacity 
            style={[styles.checkboxContainer, { opacity: isEditing ? 1 : 0.5 }]} 
            onPress={onPress} 
            disabled={!isEditing}
            activeOpacity={0.7}
        >
            <View style={styles.customCheckboxFrame}>
                {isSelected ? (
                    <IMAGES.CheckBoxTrue style={styles.checkmarkIcon} />
                ) : (

                    <IMAGES.CheckBoxFalse style={styles.checkmarkIcon} /> 
                )}
            </View>
            
            {!!label && (
                <Text style={styles.checkboxLabel}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}