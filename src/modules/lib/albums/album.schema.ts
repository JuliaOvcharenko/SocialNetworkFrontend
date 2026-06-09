import * as yup from "yup";

export const createAlbumSchema = yup.object({
    name: yup.string()
        .required("Введіть назву альбому")
        .min(2, "Назва має бути не менше 2 символів")
        .max(50, "Назва має бути не більше 50 символів"),

    theme: yup.string()         
        .min(2, "Тема має бути не менше 2 символів")
        .max(30, "Тема має бути не більше 30 символів")
        .nullable()
        .default(null),

    year: yup.number()
        .typeError("Рік має бути числом")
        .max(new Date().getFullYear(), `Рік не може бути більшим за ${new Date().getFullYear()}`)
        .nullable()
        .default(null),

    isShown: yup.boolean()       
        .required()
        .default(true),
});

export type CreateAlbumFormData = yup.InferType<typeof createAlbumSchema>;