import { generateId } from "~/lib/utils";

import { db } from "db";
import { users } from "db/schema/users";

import type { AuthFormData } from "~/lib/schemas/auth";

import {
  createPassword,
  createUserSession,
} from "../auth/create.server";
import { hardDeleteUser } from "./delete.server";
import { hardDeletePassword } from "../auth/delete.server";

export const createUser = async (email: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { and, eq, not }) =>
        and(not(eq(users.status, "DELETED")), eq(users.email, email)),
    });

    if (existingUser) {
      return {
        message: "User already exists",
        errorData: { email, existingUser },
      };
    }

    const result = await db
      .insert(users)
      .values({
        id: generateId("workspace"),
        email,
        status: "ACTIVE",
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!result) {
      return {
        message: "There was an error on database",
        errorData: { email },
      };
    }
    return {
      message: "User created successfully",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { email },
    };
  }
};

export const register = async (formData: AuthFormData) => {
  try {
    // Create user
    const user = await createUser(formData.email);
    // If user creation fails, return the error
    if (!user.successData) {
      return {
        message: user.message,
        errorData: { email: formData.email },
      };
    }
    // Create password
    const password = await createPassword(
      formData.password,
      user.successData.id
    );
    // If password creation fails, delete the user and return the error
    if (!password.successData) {
      // Delete user
      const deletedUser = await hardDeleteUser(user.successData.id);
      // If user deletion fails, return the error
      if (!deletedUser.successData) {
        return {
          message: deletedUser.message,
          errorData: { email: formData.email },
        };
      }
      // Return the error
      return {
        message: password.message,
        errorData: { email: formData.email },
      };
    }
    // Create session
    const session = await createUserSession(user.successData);
    // If session creation fails, delete the user and password and return the error
    if (!session.successData) {
      // Delete user
      const deletedUser = await hardDeleteUser(user.successData.id);
      // If user deletion fails, return the error
      if (!deletedUser.successData) {
        return {
          message: deletedUser.message,
          errorData: { email: formData.email },
        };
      }
      // Delete password
      const deletedPassword = await hardDeletePassword(
        password.successData.id
      );
      // If password deletion fails, return the error
      if (!deletedPassword.successData) {
        return {
          message: deletedPassword.message,
          errorData: { email: formData.email },
        };
      }
      // Return the error
      return {
        message: session.message,
        errorData: { email: formData.email },
      };
    }
    // Return the success data
    return {
      message: "Registration successful",
      successData: {
        user: user.successData,
        session: session.successData,
      },
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { email: formData.email },
    };
  }
};
