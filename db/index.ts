import { drizzle } from "drizzle-orm/libsql";
// import { createClient } from "libsql-stateless-easy";
import { createClient } from "@libsql/client";

import * as users from "./schema/users";
import * as passwords from "./schema/passwords";
import * as contacts from "./schema/contacts";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client as any, {
  schema: {
    ...users,
    ...passwords,
    ...contacts,
  },
});
