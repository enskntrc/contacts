import type {
  ContactStatus,
  DB_NakedContact,
} from "db/schema/contacts";
import type { ContactFormData } from "../schemas/contact";

export type CreateContactsProps = {
  userId: string;
  data: ContactFormData;
  imgPath?: string;
  imgUrl?: string;
  base64Image?: string;
};

export type UpdateContactsProps = {
  id: string;
  data: ContactFormData;
  imgPath?: string;
  imgUrl?: string;
  base64Image?: string;
};

export type GetContactsProps = {
  userId: string;
  status?: ContactStatus[];
  orderType?: "asc" | "desc";
  orderBy?: DB_NakedContact;
};
