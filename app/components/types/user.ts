import { UserStatus } from "db/schema/users";

export type NakedUser = {
  id: string;
  email: string;
  name: string | null;
  status: UserStatus;
  is_google_signup: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};
