import { db } from "db";
import { contacts } from "db/schema/contacts";
import { generateId } from "../utils";
import { CreateContactsProps } from "../types/contacts";

import { uploadImage } from "./upload.server";

export const createContact = async ({
  userId,
  data,
}: CreateContactsProps) => {
  try {
    const response = await db
      .insert(contacts)
      .values({
        id: generateId("workspace"),
        status: "ACTIVE",
        user_id: userId,
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

export const createContactWithImage = async ({
  userId,
  data,
  imgPath,
}: CreateContactsProps) => {
  try {
    const responseCreateContact = await createContact({
      userId,
      data,
    });
    if (responseCreateContact.error) {
      return {
        error: responseCreateContact.error,
        message: responseCreateContact.message,
      };
    }

    if (imgPath) {
      const responseUploadImage = await uploadImage(imgPath);
      if (responseUploadImage.error) {
        return {
          error: responseUploadImage.error,
          message: responseUploadImage.message,
        };
      }
    }

    return {
      success: { createdContact: responseCreateContact.success },
      message: responseCreateContact.message,
    };
  } catch (error: any) {
    return {
      error: { createFormData: data },
      message: error.message,
    };
  }
};
