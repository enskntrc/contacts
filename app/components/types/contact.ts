import { ContactStatus } from "db/schema/contacts";

export type Contact = {
  // attributes
  id: string;
  name: string;
  email: string;
  phone: string;
  job?: string;
  company?: string;
  status: ContactStatus;
  // timestamps
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
