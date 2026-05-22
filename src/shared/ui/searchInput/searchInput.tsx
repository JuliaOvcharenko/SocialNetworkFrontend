import React from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './searchInput.styles';
import { IMAGES } from '../images'; 
import { COLOURS } from '@shared/constants/colours';

interface SearchInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchInput({ value, onChangeText, placeholder = 'Пошук' }: SearchInputProps) {
    return (
        <View style={styles.container}>
            <IMAGES.SearchIcon style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLOURS.Gray50}
            />

        </View>
    );
}