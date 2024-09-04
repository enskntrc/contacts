import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GoogleStrategy } from "remix-auth-google";

import { sessionStorage } from "./session.server";
import { DB_NakedUser, users } from "db/schema/users";
import { z } from "zod";
import { db } from "db";
import { generateId } from "~/lib/utils";
import { passwords } from "db/schema/passwords";

const payloadSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  password: z.string(),
  type: z.enum(["login", "register"]),
});

export const authenticator = new Authenticator<DB_NakedUser>(
  sessionStorage
);

const formStrategy = new FormStrategy(async ({ context }) => {
  const parsedData = payloadSchema.safeParse(context);

  if (parsedData.success) {
    const { name, email, password, type } = parsedData.data;

    if (type === "login") {
      const user = await db.query.users.findFirst({
        with: { password: true },
        where: (users, { and, eq }) =>
          and(eq(users.status, "ACTIVE"), eq(users.email, email)),
      });

      if (user) {
        if (user.is_google_signup && !user.password) {
          throw new Error("GOOGLE_SIGNUP");
        }

        const isValid = await bcrypt.compare(
          password,
          user.password.hash
        );
        if (isValid) {
          return user;
        } else {
          // TODO: type errors well
          throw new Error("INVALID_PASSWORD");
        }
      }
    } else {
      const user = await db
        .insert(users)
        .values({
          id: generateId("workspace"),
          name,
          email,
          status: "ACTIVE",
        })
        .returning()
        .then((res) => res[0] ?? null);

      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .insert(passwords)
        .values({
          id: generateId("workspace"),
          user_id: user.id,
          hash: hashedPassword,
          status: "ACTIVE",
        })
        .returning()
        .then((res) => res[0] ?? null);

      return user;
    }
  } else {
    throw new Error("Parsing Failed", {
      cause: parsedData.error.flatten(),
    });
  }

  throw new Error("Login failed");
});

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.HOST_URL
      ? `${process.env.HOST_URL}/google/callback`
      : "http://localhost:3000/google/callback",
  },
  async ({ profile }) => {
    return await db
      .insert(users)
      .values({
        id: generateId("workspace"),
        name: profile.displayName,
        email: profile.emails[0].value,
        is_google_signup: true,
        status: "ACTIVE",
      })
      .returning()
      .then((res) => res[0] ?? null);
  }
);

authenticator
  .use(formStrategy, "user-pass")
  .use(googleStrategy, "google");
