import { db } from "db";
import { contacts } from "db/schema/contacts";
import { ContactFormData } from "~/lib/schemas/contact";
import { generateId } from "~/lib/utils";

export const createContact = async (formData: ContactFormData) => {
  try {
    const result = await db
      .insert(contacts)
      .values({
        id: generateId("workspace"),
        status: "ACTIVE",
        ...formData,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!result) {
      return {
        message: "There was an error creating the contact.",
        errorData: { formData },
      };
    }
    return {
      message: "Contact created successfully.",
      successData: result,
    };
  } catch (e: any) {
    return {
      message: e.message,
      errorData: { formData },
    };
  }
};
