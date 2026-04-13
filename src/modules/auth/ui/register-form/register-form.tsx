import React from 'react';
import { View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@shared/ui/input/input';
import { Button } from '@shared/ui/button/button';
import { RegisterFormFields } from '@modules/types/auth.types';
import { registerValidator } from '@modules/lib/login/register.schema';
import { styles } from './register-form.styles';
import { useRegisterMutation } from '@modules/auth/api/auth-api';
import { useRouter } from 'expo-router';



export function RegisterForm() {
    const router = useRouter()
    const [register, { isLoading }] = useRegisterMutation();

    const { control, handleSubmit } = useForm<RegisterFormFields>({
        resolver: yupResolver(registerValidator),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormFields) => {
        try {
            await register({ 
                email: data.email, 
                password: data.password 
            }).unwrap();

            router.push({
                pathname: "/verify", 
                params: { email: data.email } 
            });

        } catch (err: any) {
            console.log('FULL ERROR:', JSON.stringify(err, null, 2));
            Alert.alert('Помилка', err.data?.message || 'Помилка при реєстрації');
        }
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
                        editable={!isLoading}
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
                        editable={!isLoading}
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
                        editable={!isLoading}
                    />
                )}
            />

            <Button
                title={isLoading ? "Створення..." : "Створити акаунт"}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                disabled={isLoading}
            />
        </View>
    );
}