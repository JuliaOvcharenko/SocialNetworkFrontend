import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@shared/ui/input/input'; 
import { Button } from '@shared/ui/button/button';
import { LoginFormFields } from '@modules/types/auth.types';
import { loginValidator } from '@modules/lib/login/login.validation';
import { styles } from './login-form.styles';


export function LoginForm() {
    const { control, handleSubmit } = useForm<LoginFormFields>({
        resolver: yupResolver(loginValidator),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormFields) => {
        console.log('Данные для входа:', data);
    };

    return (
        <View style={styles.container}>
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

            <Button
                title="Увійти"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
            />
        </View>
    );
}