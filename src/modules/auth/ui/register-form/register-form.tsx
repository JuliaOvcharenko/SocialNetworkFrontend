import React from 'react';
import { View, Text } from 'react-native'; // Убрали Alert, добавили Text
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@shared/ui/input/input';
import { Button } from '@shared/ui/button/button';
import { RegisterFormFields } from '@modules/types/auth.types';
import { registerValidator } from '@modules/lib/login/register.schema';
import { styles } from './register-form.styles';
import { useRegisterMutation } from '@modules/auth/api/auth-api';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function RegisterForm() {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();

    // Достаем formState: { errors } для отображения корневой ошибки
    const { control, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormFields>({
        resolver: yupResolver(registerValidator),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormFields) => {
        try {
            const response = await register({ 
                email: data.email, 
                password: data.password 
            }).unwrap();

            await AsyncStorage.setItem("token", response.token);

            router.push({
                pathname: "/verify", 
                params: { email: data.email } 
            });

        } catch (err: any) {
            console.log('FULL ERROR:', JSON.stringify(err, null, 2));
            
            const serverMessage = err.data?.message || 'Помилка при реєстрації. Спробуйте ще раз.';

            // Проверяем на занятую почту
            if (serverMessage.toLowerCase().includes('user') || serverMessage.toLowerCase().includes('email')) {
                // Ошибка конкретного поля
                setError('email', { 
                    type: 'server', 
                    message: 'Користувач з такою поштою вже існує' 
                });
            } else {
                // иная ошибка сервера уходит в root
                setError('root', { 
                    type: 'server', 
                    message: serverMessage 
                });
            }
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

            {/* блок для вывода неизвестных ошибок сервера над кнопкой */}
            {errors.root && (
                <Text style={{ color: '#FF3B30', textAlign: 'center', marginBottom: 12, fontSize: 14 }}>
                    {errors.root.message}
                </Text>
            )}

            <Button
                title={isLoading ? "Створення..." : "Створити акаунт"}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                disabled={isLoading}
            />
        </View>
    );
}