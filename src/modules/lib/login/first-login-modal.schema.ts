import * as yup from 'yup';

const usernameRegex = /^@[a-zA-Z]{3,}$/;

export const firstLoginSchema = yup.object().shape({
    authorAlias: yup.string()
        .required("Введіть псевдонім")
        .min(3, "Мінімум 3 символи"),
        
    nickname: yup.string()
        .required("Введіть ім'я користувача")
        .matches(usernameRegex, "Має починатися з @ та містити від 3 англ. літер"),
});

export type FirstLoginFormData = yup.InferType<typeof firstLoginSchema>;