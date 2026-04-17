import React from 'react';
import { View } from 'react-native';
import { Control, FieldErrors, Controller } from "react-hook-form";
import { Input } from "@shared/ui/input";
import { SettingsFormData } from "../../lib/settings/settings.schema";

interface PasswordFormProps {
    control: Control<SettingsFormData>;
    errors: FieldErrors<SettingsFormData>;
    isEditing: boolean;
}

export function PasswordForm({ control, errors, isEditing }: PasswordFormProps) {
    return (
        <View>
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        editable={isEditing}
                        label={isEditing ? "Новий пароль" : "Пароль"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message}
                        isPassword={true}
                    />
                )}
            />

            {isEditing && (
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            editable={true}
                            label="Підтвердіть новий пароль"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors.confirmPassword?.message}
                            isPassword={true}
                            
                        />
                    )}
                />
            )}
        </View>
    );
}