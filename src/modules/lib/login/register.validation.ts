import * as yup from "yup";

export const registerValidator = yup
	.object({
		email: yup
			.string()
			.required("Обов’язкове поле")
			.email("Невірний формат пошти"),

		password: yup
			.string()
			.required("Обов’язкове поле")
			.min(6, "Пароль має бути не менше 6 символів"),

		confirmPassword: yup
			.string()
			.required("Підтвердіть пароль")
			.oneOf([yup.ref("password")], "Паролі не співпадають"),
	})
	.required();
