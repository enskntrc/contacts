import { ContactStatus } from "db/schema/contacts";

export type Contact = {
  // attributes
  id: string;
  status: ContactStatus;
  img_url: string | null;
  img_path: string | null;
  prefix: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  phonetic_first: string | null;
  phonetic_middle: string | null;
  phonetic_last: string | null;
  nickname: string | null;
  file_as: string | null;

  company: string | null;
  job_title: string | null;
  department: string | null;

  email: string;
  phone: string;

  country: string | null;
  street: string | null;
  postcode: string | null;
  district: string | null;
  province: string | null;

  b_day: string | null;
  b_month: string | null;
  b_year: string | null;

  notes: string | null;

  // relationships
  user_id: string;

  // timestamps
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type ContactFormProps = {
  userId: string;
  contact?: Contact;
  imgPath?: string | null;
  imgUrl?: string | null;
};

export type Action = "?/create" | "?/update";
