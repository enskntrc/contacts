import { db } from "db";
import { contacts } from "db/schema/contacts";
import { generateId } from "../utils";
import { CreateContactsProps } from "../types/contacts";

export const createContact = async ({
  userId,
  imgPath,
  imgUrl,
  data,
}: CreateContactsProps) => {
  try {
    const response = await db
      .insert(contacts)
      .values({
        id: generateId("workspace"),
        status: "ACTIVE",
        user_id: userId,
        img_path: imgPath,
        img_url: imgUrl,
        ...data,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!response) {
      return {
        error: { createFormData: data },
        message: "There was an error creating the contact",
      };
    }

    return {
      success: { createdContact: response },
      message: "Contact created successfully",
    };
  } catch (error: any) {
    return {
      error: { createFormData: data },
      message: "There was an error creating the contact",
    };
  }
};
