import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images"; 

interface SignatureVariantsProps {
    isEditing: boolean;
    isAliasSelected: boolean;
    onAliasToggle: () => void;
    isElectronicSelected: boolean;
    onElectronicToggle: () => void;
    signatureImageUri: string | null;
    onSignatureImageChange: (uri: string) => void;
    authorAlias: string;
}

export function SignatureVariants({ 
    isEditing, 
    isAliasSelected,
    onAliasToggle,
    isElectronicSelected,
    onElectronicToggle,
    signatureImageUri, 
    onSignatureImageChange,
    authorAlias
}: SignatureVariantsProps) {

    const pickSignatureImage = async () => {
        if (!isEditing) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], 
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            onSignatureImageChange(result.assets[0].uri);
            if (!isElectronicSelected) {
                onElectronicToggle();
            }
        }
    };

    const Checkbox = ({ isSelected, label, onPress }: { isSelected: boolean, label: string, onPress: () => void }) => (
        <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={onPress} 
            disabled={!isEditing}
        >
            {isSelected ? (
                <IMAGES.CheckBoxTrue style={styles.icon} />
            ) : (
                <IMAGES.CheckBoxFalse style={styles.icon} />
            )}
            <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.variantBlock}>
                <Checkbox 
                    isSelected={isAliasSelected} 
                    label="Псевдонім автора" 
                    onPress={onAliasToggle} 
                />
                <Text style={styles.aliasText}>{authorAlias}</Text>
            </View>

            <View style={styles.variantBlock}>
                <Checkbox 
                    isSelected={isElectronicSelected} 
                    label="Мій електронний підпис" 
                    onPress={onElectronicToggle} 
                />
                
                <TouchableOpacity onPress={pickSignatureImage} disabled={!isEditing}>
                    {signatureImageUri ? (
                        <Image source={{ uri: signatureImageUri }} style={styles.signatureImage} resizeMode="contain" />
                    ) : (
                        <View style={[styles.signaturePlaceholder, !isEditing && { opacity: 0.5 }]}>
                            <Text style={styles.placeholderText}>Натисніть, щоб додати підпис</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    variantBlock: {
        marginBottom: 24, 
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9A8C9E', 
    },
    checkboxLabelSelected: {
        color: '#9A8C9E',
    },
    aliasText: {
        fontSize: 16,
        color: COLOURS.darkBlue, 
    },
    signatureImage: {
        width: 160,
        height: 60,
        alignSelf: 'flex-start', 
    },
    signaturePlaceholder: {
        width: 160,
        height: 60,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9F9F9',
        alignSelf: 'flex-start', 
    },
    placeholderText: {
        fontSize: 10,
        color: '#9E9E9E',
        textAlign: 'center',
        padding: 4,
    }
});