import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@shared/ui/input/input';
import { Button } from '@shared/ui/button/button';
import { RegisterFormFields } from '@modules/types/auth.types';
import { registerValidator } from '@modules/lib/login/register.schema';
import { styles } from './register-form.styles';

export function RegisterForm() {
    const { control, handleSubmit } = useForm<RegisterFormFields>({
        resolver: yupResolver(registerValidator),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegisterFormFields) => {
        console.log('Данные регистрации:', data);
    };

    return (
        <View>
            <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input
                        label="Електронна пошта"
                        placeholder="you@example.com"
                        onChangeText={onChange}
                        value={value}
                        error={error?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input
                        label="Пароль"
                        placeholder="Введи пароль"
                        onChangeText={onChange}
                        value={value}
                        error={error?.message}
                        isPassword={true}
                    />
                )}
            />

            <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input
                        label="Підтверди пароль"
                        placeholder="Повтори пароль"
                        onChangeText={onChange}
                        value={value}
                        error={error?.message}
                        isPassword={true}
                    />
                )}
            />

            <Button
                title="Створити акаунт"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
            />
        </View>
    );
}