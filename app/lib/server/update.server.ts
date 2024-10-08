import { db } from "db";
import { eq } from "drizzle-orm";
import { contacts } from "db/schema/contacts";
import { UpdateContactsProps } from "../types/contacts";

import { uploadImage } from "./upload.server";

export const updateContact = async ({
  id,
  data,
  imgPath,
  imgUrl,
}: UpdateContactsProps) => {
  try {
    const response = await db
      .update(contacts)
      .set({
        updated_at: new Date(),
        img_path: imgPath,
        img_url: imgUrl,
        ...data,
      })
      .where(eq(contacts.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!response) {
      return {
        error: { updateFormData: data },
        message: "There was an error updating the contact",
      };
    }

    return {
      success: { updatedContact: response },
      message: "Contact updated successfully",
    };
  } catch (error: any) {
    return {
      error: { updateFormData: data },
      message: error.message,
    };
  }
};

export const updateContactWithImage = async ({
  id,
  data,
  base64Image,
}: UpdateContactsProps) => {
  try {
    if (base64Image) {
      const responseUploadImage = await uploadImage(base64Image);
      if (!responseUploadImage.success) {
        return {
          error: responseUploadImage.error,
          message: responseUploadImage.message,
        };
      }

      const responseUpdateContact = await updateContact({
        id,
        data,
        imgPath: responseUploadImage.success.url,
        imgUrl: responseUploadImage.success.url,
      });

      if (responseUpdateContact.error) {
        return {
          error: responseUpdateContact.error,
          message: responseUpdateContact.message,
        };
      }

      return {
        success: {
          updatedContact: responseUpdateContact.success,
          uploadedImage: responseUploadImage.success,
        },
        message: responseUpdateContact.message,
      };
    }

    const response = await updateContact({
      id,
      data,
    });
    if (response.error) {
      return {
        error: response.error,
        message: response.message,
      };
    }
    return {
      success: response.success,
      message: response.message,
    };
  } catch (error: any) {
    return {
      error: { data, base64Image },
      message: error.message,
    };
  }
};

export const softDeleteContact = async (id: string) => {
  try {
    const response = await db
      .update(contacts)
      .set({
        status: "DELETED",
        deleted_at: new Date(),
      })
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

export const recoverContact = async (id: string) => {
  try {
    const response = await db
      .update(contacts)
      .set({
        updated_at: new Date(),
        status: "ACTIVE",
      })
      .where(eq(contacts.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!response) {
      return {
        error: { id },
        message: "There was an error recovering the contact",
      };
    }

    return {
      success: response,
      message: "Contact recovered successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
      message: "There was an error recovering the contact",
    };
  }
};
