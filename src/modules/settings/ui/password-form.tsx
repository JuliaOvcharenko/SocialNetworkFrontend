import React from 'react';
import { Control, FieldErrors, Controller } from "react-hook-form";
import { Input } from "@shared/ui/input"; 
import { SettingsFormData } from '@modules/lib/settings/settings.schema';

interface PasswordFormProps {
    control: Control<SettingsFormData>;
    errors: FieldErrors<SettingsFormData>;
    isEditing: boolean;
}

export function PasswordForm({ control, errors, isEditing }: PasswordFormProps) {
    return (
        <Controller 
            control={control} 
            name="password" 
            render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                    editable={isEditing} 
                    label="Пароль" 
                    isPassword={true} 
                    onBlur={onBlur} 
                    onChangeText={onChange} 
                    value={value} 
                    error={errors.password?.message} 
                />
            )} 
        />
    );
}