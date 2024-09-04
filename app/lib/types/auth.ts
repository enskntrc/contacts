import { DB_NakedUser } from "db/schema/users";

export type ResponseLogin = {
  message: string;
  errorData?: {
    email: string;
  };
  successData?: {
    user: DB_NakedUser;
  };
};
