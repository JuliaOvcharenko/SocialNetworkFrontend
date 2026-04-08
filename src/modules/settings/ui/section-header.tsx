import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images"; 

interface SectionHeaderProps {
    title: string;
    isEditing?: boolean;
    onEditPress: () => void;
}

export function SectionHeader({ title, isEditing, onEditPress }: SectionHeaderProps) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity style={styles.editCircle} onPress={onEditPress}>
                {isEditing ? (
                    <Text style={{ color: COLOURS.darkBlue, fontSize: 18 }}>✓</Text>
                ) : (
                    <IMAGES.PenButton />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOURS.darkBlue,
    },
    editCircle: {
        width: 40,         
        height: 40,        
        borderRadius: 20,  
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
});