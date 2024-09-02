import { z } from "zod";

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const schema = z.object({
  email: z
    .string({
      message: "Bu alan boş bırakılamaz",
    })
    .min(1, {
      message: "En az 1 karakter olmalıdır",
    })
    .email({
      message: "Geçerli bir e-posta adresi giriniz",
    }),
  password: z
    .string({
      message: "Bu alan boş bırakılamaz",
    })
    .min(8, {
      message: "En az 8 karakter olmalıdır",
    })
    .refine((data) => passwordValidation.test(data), {
      message: "Girdiğiniz şifre eksik karakter içeriyor",
    }),
});

export type AuthFormData = z.infer<typeof schema>;
