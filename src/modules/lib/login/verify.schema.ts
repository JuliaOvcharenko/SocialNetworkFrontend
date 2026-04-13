import * as yup from "yup";

export const verifyValidator = yup
  .object({
    code: yup
      .string()
      .required("Введіть код підтвердження")
      .matches(/^[0-9]+$/, "Код повинен складатися лише з цифр")
      .length(6, "Код повинен містити рівно 6 символів"),
  })
  .required();