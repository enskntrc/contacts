import { db } from "db";
import { contacts } from "db/schema/contacts";
import { generateId } from "../utils";
import { CreateContactsProps } from "../types/contacts";

import { uploadImage } from "./upload.server";

export const createContact = async ({
  userId,
  data,
  imgPath,
  imgUrl,
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

export const createContactWithImage = async ({
  userId,
  data,
  base64Image,
}: CreateContactsProps) => {
  try {
    if (base64Image) {
      const responseUploadImage = await uploadImage(base64Image);
      if (!responseUploadImage.success) {
        return {
          error: responseUploadImage.error,
          message: responseUploadImage.message,
        };
      }
      const responseCreateContact = await createContact({
        userId,
        data,
        imgPath: responseUploadImage.success.path,
        imgUrl: responseUploadImage.success.url,
      });
      if (responseCreateContact.error) {
        return {
          error: responseCreateContact.error,
          message: responseCreateContact.message,
        };
      }
      return {
        success: {
          createdContact: responseCreateContact.success,
          uploadedImage: responseUploadImage.success,
        },
        message: responseCreateContact.message,
      };
    }

    const response = await createContact({
      userId,
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
