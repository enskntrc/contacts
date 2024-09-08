import type {
  ContactStatus,
  DB_NakedContact,
} from "db/schema/contacts";
import type { ContactFormData } from "../schemas/contact";

export type CreateContactsProps = {
  userId: string;
  imgPath?: string;
  imgUrl?: string;
  data: ContactFormData;
};

export type UpdateContactsProps = {
  id: string;
  imgPath?: string;
  imgUrl?: string;
  data: ContactFormData;
};

export type GetContactsProps = {
  userId: string;
  status?: ContactStatus[];
  orderType?: "asc" | "desc";
  orderBy?: DB_NakedContact;
};
