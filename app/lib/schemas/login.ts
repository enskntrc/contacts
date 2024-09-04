import { z } from "zod";

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const schema = z.object({
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
});

export type LoginFormData = z.infer<typeof schema>;
