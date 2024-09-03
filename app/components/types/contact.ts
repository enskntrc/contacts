import { ContactStatus } from "db/schema/contacts";

export type Contact = {
  // attributes
  id: string;
  status: ContactStatus;
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

  // timestamps
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
