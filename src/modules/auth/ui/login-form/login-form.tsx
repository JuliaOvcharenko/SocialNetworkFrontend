import React from "react";
import { View, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input } from "@shared/ui/input/input";
import { Button } from "@shared/ui/button/button";
import { LoginFormFields } from "@modules/types/auth.types";
import { loginValidator } from "@modules/lib/login/login.schema";
import { styles } from "./login-form.styles";
import { useLoginMutation } from "@modules/auth/api/login-api";
import { useRouter } from "expo-router";

export function LoginForm() {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();

    const { control, handleSubmit, setError, formState: { errors } } = useForm<LoginFormFields>({
        resolver: yupResolver(loginValidator),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormFields) => {
        try {
            const result = await login(data).unwrap();
            await AsyncStorage.setItem("token", result.token);

            router.replace('/core');

        } catch (err: any) {

            const serverMessage = err.data?.message || "";


            if (serverMessage.toLowerCase().includes('password') || serverMessage.toLowerCase().includes('email') || serverMessage.toLowerCase().includes('user') || serverMessage.toLowerCase().includes('invalid')) {
                setError('root', {
                    type: 'server',
                    message: 'Невірна електронна пошта або пароль'
                });
            } else {

                setError('root', {
                    type: 'server',
                    message: serverMessage || 'Не вдалося увійти. Спробуйте пізніше.'
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Controller
                name="email"
                control={control}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
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
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
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

            {errors.root && (
                <Text style={{ color: '#FF3B30', textAlign: 'center', marginBottom: 12, fontSize: 14 }}>
                    {errors.root.message}
                </Text>
            )}

            <Button
                title={isLoading ? "Вхід..." : "Увійти"}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                disabled={isLoading}
            />
        </View>
    );
}