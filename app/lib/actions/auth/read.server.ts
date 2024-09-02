import { db } from "db";
import bcrypt from "bcryptjs";

import { createUserSession, getSession } from "./create.server";

export const login = async (email: string, password: string) => {
  try {
    const user = await db.query.users.findFirst({
      with: { password: true },
      where: (users, { and, eq, not }) =>
        and(not(eq(users.status, "DELETED")), eq(users.email, email)),
    });

    if (!user) {
      return {
        message: "User not found",
        errorData: { email },
      };
    }

    const isValid = await bcrypt.compare(
      password,
      user.password.hash
    );

    if (!isValid) {
      return {
        message: "Invalid password",
        errorData: { email },
      };
    }

    const session = await createUserSession(user);

    if (!session.successData) {
      return {
        message: session.message,
        errorData: { email },
      };
    }

    return {
      message: "Login successful",
      successData: {
        user,
        session: session.successData,
      },
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { email },
    };
  }
};

export const getUserFromSession = async (request: Request) => {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const result = session.get("user");

    if (!result) {
      return {
        message: "Session not found",
      };
    }

    return {
      message: "Session found",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
    };
  }
};
