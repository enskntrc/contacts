import { z } from "zod";

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const schema = z
  .object({
    name: z.string({
      message: "Can't be empty",
    }),
    email: z
      .string({
        message: "Can't be empty",
      })
      .email({
        message: "Invalid email",
      }),
    password: z
      .string({
        message: "Can't be empty",
      })
      .min(8, {
        message: "At least 8 characters",
      })
      .refine((data) => passwordValidation.test(data), {
        message: "Invalid password",
      }),
    confirmPassword: z
      .string({
        message: "Can't be empty",
      })
      .min(8, {
        message: "At least 8 characters",
      })
      .refine((data) => passwordValidation.test(data), {
        message: "Invalid password",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Please make sure your passwords match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof schema>;
