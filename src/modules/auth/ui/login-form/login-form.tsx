import React from "react";
import { View, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input } from "@shared/ui/input/input";
import { Button } from "@shared/ui/button/button";
import { LoginFormFields } from "@modules/types/auth.types";
import { loginValidator } from "@modules/lib/login/login.schema";
import { styles } from "./login-form.styles";
import { useLoginMutation } from "@modules/auth/api/login-api";


export function LoginForm() {
	const [login, { isLoading }] = useLoginMutation();

	const { control, handleSubmit } = useForm<LoginFormFields>({
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
			Alert.alert("Успіх", "Ви увійшли в систему");
		} catch (err: any) {
			Alert.alert("Помилка", err.data?.message || "Не вдалося увійти");
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

			<Button
				title={isLoading ? "Вхід..." : "Увійти"}
				onPress={handleSubmit(onSubmit)}
				style={styles.submitButton}
				disabled={isLoading}
			/>
		</View>
	);
}
