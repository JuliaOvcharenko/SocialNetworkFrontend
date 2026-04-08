import React from 'react';
import { Control, FieldErrors, Controller } from "react-hook-form";
import { Input } from "@shared/ui/input";
import { SettingsFormData } from '@modules/lib/settings/settings.schema';

interface PersonalDataFormProps {
    control: Control<SettingsFormData>;
    errors: FieldErrors<SettingsFormData>;
    isEditing: boolean;
}

export function PersonalDataForm({ control, errors, isEditing }: PersonalDataFormProps) {
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
                    />
                )} 
            />
            
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
                    />
                )} 
            />
            
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
                    />
                )} 
            />
        </>
    );
}

