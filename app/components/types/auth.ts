import type { UserStatus } from "db/schema/users";

export type Action = "?/login" | "?/register";

export type UserFromSession = {
  id: string;
  email: string;
  status: UserStatus;
};
