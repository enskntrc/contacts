import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
import { createCookieSessionStorage } from "@remix-run/node";
import type { DB_NakedUser } from "db/schema/users";
import { db } from "db";
import { passwords } from "db/schema/passwords";
import { generateId } from "~/lib/utils";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } =
  sessionStorage;

export const createUserSession = async (user: DB_NakedUser) => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        message: "Session not found",
        errorData: { user },
      };
    }

    session.set("user", {
      id: user.id,
      email: user.email,
      status: user.status,
    });

    const result = await commitSession(session);
    if (!result) {
      return {
        message: "Session not created",
        errorData: { user },
      };
    }

    return {
      message: "Session created",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { user },
    };
  }
};

export const createPassword = async (
  password: string,
  userId: string
) => {
  try {
    const existingPassword = await db.query.passwords.findFirst({
      where: (passwords, { and, not, eq }) =>
        and(
          not(eq(passwords.status, "DELETED")),
          eq(passwords.user_id, userId)
        ),
    });

    if (existingPassword) {
      return {
        message: "There is already a password for this user",
        errorData: { userId },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .insert(passwords)
      .values({
        id: generateId("workspace"),
        user_id: userId,
        hash: hashedPassword,
        status: "ACTIVE",
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!result) {
      return {
        message: "Password not created",
        errorData: { userId },
      };
    }

    return {
      message: "Password created",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { userId },
    };
  }
};
