import * as yup from 'yup';

export const settingsSchema = yup.object().shape({
    authorAlias: yup.string().required("Введіть ПІБ автора"),
    nickname: yup.string().required("Введіть нікнейм користувача"),

    name: yup.string()
        .required("Введіть ім'я")
        .min(3, "Мінімум 3 символи"),        
    surname: yup.string()
        .required("Введіть прізвище")
        .min(3, "Мінімум 3 символи"),        
    birthDate: yup.string()
        .required("Введіть дату народження"), 
        
    email: yup.string()
        .email("Невірний формат пошти")
        .required("Введіть електронну адресу"),
        
    password: yup.string()
        .default('')
        .test('is-length', 'Пароль має бути від 6 символів', val => !val || val.length >= 6),
    
    confirmPassword: yup.string()
        .default('')
        .test('match', 'Паролі не збігаються', function(val) {
            return !val || val === this.parent.password;
        }),
});

export type SettingsFormData = yup.InferType<typeof settingsSchema>;