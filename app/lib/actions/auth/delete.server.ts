import { db } from "db";
import { passwords } from "db/schema/passwords";
import { eq } from "drizzle-orm";

export const hardDeletePassword = async (passwordId: string) => {
  try {
    const result = await db
      .delete(passwords)
      .where(eq(passwords.id, passwordId))
      .returning()
      .then((res) => res[0] ?? null);

    if (!result) {
      return {
        message: "Password not deleted",
        errorData: { passwordId },
      };
    }

    return {
      message: "Password deleted",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { passwordId },
    };
  }
};
