import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";

export const hardDeleteUser = async (userId: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { and, eq, not }) =>
        and(not(eq(users.status, "DELETED")), eq(users.id, userId)),
    });

    if (!user) {
      return {
        message: "User not found",
        errorData: { userId },
      };
    }

    const result = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()
      .then((res) => res[0] ?? null);

    if (!result) {
      return {
        message: "User not deleted",
        errorData: { userId },
      };
    }

    return {
      message: "User deleted successfully",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { userId },
    };
  }
};
