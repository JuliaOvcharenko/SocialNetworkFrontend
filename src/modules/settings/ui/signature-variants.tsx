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

const Checkbox = ({ isSelected, label, onPress, isEditing }: CheckboxProps) => (
    <TouchableOpacity
        style={[styles.checkboxContainer, { opacity: isEditing ? 1 : 0.5 }]}
        onPress={onPress}
        disabled={!isEditing}
        activeOpacity={0.7}
    >
        {isSelected ? (
            <IMAGES.CheckBoxTrue style={styles.icon} />
        ) : (
            <IMAGES.CheckBoxFalse style={styles.icon} />
        )}
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
                <Checkbox
                    isSelected={isAliasSelected}
                    label="Псевдонім автора"
                    onPress={onAliasToggle}
                    isEditing={isEditing}
                />
                <Text style={styles.aliasText}>{authorAlias}</Text>
            </View>

            <View style={styles.variantBlock}>
                <Checkbox
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
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
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
        marginLeft: 30,
    },
    signatureImage: {
        width: '100%',
        height: 60,
    },
    viewContainer: {
        paddingLeft: 30,
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