import { db } from "db";
import { contacts } from "db/schema/contacts";
import { eq } from "drizzle-orm";

export const hardDeleteContact = async (id: string) => {
  try {
    const response = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!response) {
      return {
        error: { id },
        message: "There was an error deleting the contact",
      };
    }

    return {
      success: response,
      message: "Contact deleted successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
      message: "There was an error deleting the contact",
    };
  }
};
