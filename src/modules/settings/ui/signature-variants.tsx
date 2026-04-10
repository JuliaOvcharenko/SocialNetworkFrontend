import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { COLOURS } from "@shared/constants/colours";
import { IMAGES } from "@shared/ui/images"; 
import { Button } from "@shared/ui/button";

interface CheckboxProps {
    isSelected: boolean;
    label: string;
    onPress: () => void;
    isEditing: boolean;
}

const CustomCheckboxRow = ({ isSelected, label, onPress, isEditing }: CheckboxProps) => (
    <TouchableOpacity 
        style={[styles.checkboxContainer, { opacity: isEditing ? 1 : 0.5 }]} 
        onPress={onPress} 
        disabled={!isEditing}
        activeOpacity={0.7}
    >
        <View style={styles.customCheckboxFrame}>
            {isSelected && (
                <IMAGES.CheckBoxTrue style={styles.checkmarkIcon} />
            )}
        </View>
        
        <Text style={styles.checkboxLabel}>
            {label}
        </Text>
    </TouchableOpacity>
);

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

    return (
        <View style={styles.container}>
            <View style={styles.variantBlock}>
                <CustomCheckboxRow 
                    isSelected={isAliasSelected} 
                    label="Псевдонім автора" 
                    onPress={onAliasToggle} 
                    isEditing={isEditing} 
                />
                <Text style={styles.aliasText}>{authorAlias}</Text>
            </View>

            <View style={styles.variantBlock}>
                <CustomCheckboxRow 
                    isSelected={isElectronicSelected} 
                    label="Мій електронний підпис" 
                    onPress={onElectronicToggle} 
                    isEditing={isEditing} 
                />
                
                {isEditing ? (
                    <View>
                        <View style={styles.dashedContainer}>
                            {signatureImageUri ? (
                                <Image source={{ uri: signatureImageUri }} style={styles.signatureImage} resizeMode="contain" />
                            ) : (
                                <Text style={styles.placeholderText}>Немає підпису</Text>
                            )}
                        </View>
                        
                        <View style={styles.buttonWrapper}>
                            <Button 
                                title="Редагувати підпис" 
                                onPress={pickSignatureImage} 
                                variant="outline" 
                            />
                        </View>
                        
                    </View>
                ) : (
                    <View style={styles.viewContainer}>
                        {signatureImageUri ? (
                            <Image source={{ uri: signatureImageUri }} style={styles.signatureImage} resizeMode="contain" />
                        ) : null}
                    </View>
                )}
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
        marginBottom: 12, 
    },
    // Стили для пустой фиолетовой рамки
    customCheckboxFrame: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: COLOURS.Plum,
        borderRadius: 4, 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    // Стили для галочки внутри рамки
    checkmarkIcon: {
        width: 14, 
        height: 14,
    },
    checkboxLabel: {
        fontSize: 16, 
        fontWeight: '500', 
        color: COLOURS.Plum, 
    },
    aliasText: {
        fontSize: 16,
        fontWeight: '400',
        color: COLOURS.darkBlue, 
        marginLeft: 34,
    },
    signatureImage: {
        width: '100%',
        height: 60,
    },
    viewContainer: {
        paddingLeft: 34, 
    },
    dashedContainer: {
        width: '100%',
        height: 80,
        borderWidth: 1,
        borderColor: COLOURS.Gray, 
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        backgroundColor: COLOURS.white, 
    },
    placeholderText: {
        fontSize: 12,
        color: COLOURS.Gray, 
    },
    buttonWrapper: {
        marginTop: 16,
        alignItems: 'flex-start',
    }
});