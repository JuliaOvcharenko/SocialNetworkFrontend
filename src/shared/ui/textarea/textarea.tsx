import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

import { COLOURS } from '@shared/constants/colours';
import { styles } from './textarea.styles';

interface TextAreaProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function TextArea({ label, error, style, ...rest }: TextAreaProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError, style]}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top" 
                placeholderTextColor={COLOURS.Blue50} 
                {...rest}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}