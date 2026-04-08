import * as yup from 'yup';


export const settingsSchema = yup.object().shape({
    firstName: yup.string()
        .required("Введіть ім'я")
        .min(3, "Мінімум 3 символи"),        
    lastName: yup.string()
        .required("Введіть прізвище")
        .min(3, "Мінімум 3 символи"),        
    birthday: yup.string()
        .required("Введіть дату народження"), 
        
    email: yup.string()
        .email("Невірний формат пошти")
        .required("Введіть електронну адресу"),
        
    password: yup.string()
        .min(6, "Пароль має бути від 6 символів")
        .required("Введіть пароль"),
});

export type SettingsFormData = yup.InferType<typeof settingsSchema>;