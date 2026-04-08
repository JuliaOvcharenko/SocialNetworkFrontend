import * as yup from 'yup';

export const loginValidator = yup.object({
    email: yup.string().required('Обов’язкове поле').email('Невірний формат пошти'),
    
    password: yup.string().required('Обов’язкове поле').min(6, 'Пароль має бути не менше 6 символів'),
}).required();