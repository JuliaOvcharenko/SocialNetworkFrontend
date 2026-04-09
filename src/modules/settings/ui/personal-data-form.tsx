import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Control, FieldErrors, Controller } from "react-hook-form";
import { Input } from "@shared/ui/input";
import { SettingsFormData } from '@modules/lib/settings/settings.schema';
import { IMAGES } from "@shared/ui/images";

interface PersonalDataFormProps {
    control: Control<SettingsFormData>;
    errors: FieldErrors<SettingsFormData>;
    isEditing: boolean;
}

export function PersonalDataForm({ control, errors, isEditing }: PersonalDataFormProps) {
    const [isBirthdayPrivate, setIsBirthdayPrivate] = useState(true);
    const [isEmailPrivate, setIsEmailPrivate] = useState(true);

    return (
        <>
            <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        editable={isEditing}
                        label="Ім'я"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.firstName?.message}
                        width="90%"
                    />
                )}
            />

            <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        editable={isEditing}
                        label="Прізвище"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.lastName?.message}
                        width="90%"
                    />
                )}
            />

            <View style={styles.row}>
                <Controller
                    control={control}
                    name="birthday"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            editable={isEditing}
                            label="Дата народження"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors.birthday?.message}
                            width="90%"
                        />
                    )}
                />

                <TouchableOpacity
                    style={[styles.eyeButton, { opacity: isEditing ? 1 : 0.4 }]}
                    onPress={() => setIsBirthdayPrivate(!isBirthdayPrivate)}
                    activeOpacity={0.7}
                    disabled={!isEditing}
                >
                    {isBirthdayPrivate ? (
                        <IMAGES.EyeClose style={styles.eyeIcon} />
                    ) : (
                        <IMAGES.EyeOpen style={styles.eyeIcon} />
                    )}
                </TouchableOpacity>
            </View>


            <View style={styles.row}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            editable={isEditing}
                            label="Електронна адреса"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors.email?.message}
                            width="90%"
                        />
                    )}
                />

                <TouchableOpacity
                    style={[styles.eyeButton, { opacity: isEditing ? 1 : 0.4 }]}
                    onPress={() => setIsEmailPrivate(!isEmailPrivate)}
                    activeOpacity={0.7}
                    disabled={!isEditing}
                >
                    {isEmailPrivate ? (
                        <IMAGES.EyeClose style={styles.eyeIcon} />
                    ) : (
                        <IMAGES.EyeOpen style={styles.eyeIcon} />
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    eyeButton: {
        width: '10%',
        alignItems: 'center',
        marginStart: 7,
        marginTop: 42,
    },
    eyeIcon: {
        width: 20,
        height: 20,
    }
});