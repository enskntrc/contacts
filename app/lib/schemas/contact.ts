import { z } from "zod";

export const schema = z.object({
  prefix: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  suffix: z.string().optional(),
  phonetic_first: z.string().optional(),
  phonetic_middle: z.string().optional(),
  phonetic_last: z.string().optional(),
  nickname: z.string().optional(),
  file_as: z.string().optional(),

  company: z.string().optional(),
  job_title: z.string().optional(),
  department: z.string().optional(),

  email: z.string().optional(),
  phone: z.string().optional(),

  country: z.string().optional(),
  street: z.string().optional(),
  postcode: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),

  b_day: z.string().optional(),
  b_month: z.string().optional(),
  b_year: z.string().optional(),

  notes: z.string().optional(),
});

export type ContactFormData = z.infer<typeof schema>;
