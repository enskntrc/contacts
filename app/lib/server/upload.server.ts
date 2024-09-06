import { s3UploadHandler } from "../services/s3.server";
import { generateRandomFileName, getS3ImageUrl } from "../utils";

export const uploadImage = async (data: string) => {
  try {
    // Extract file content from base64
    const [, base64Content] = data.split(",");
    const buffer = Buffer.from(base64Content!, "base64");

    // Upload to S3
    const imagePath = await s3UploadHandler({
      name: "image",
      contentType: "image/jpeg",
      data: (async function* () {
        yield buffer;
      })(),
      filename: generateRandomFileName("image.jpg"),
    });

    // Return error if upload failed
    if (!imagePath) {
      return {
        error: { base64Content: data },
        message: "There was an error uploading to S3",
      };
    }

    // Return success message
    return {
      success: {
        url: getS3ImageUrl(imagePath as string),
        path: imagePath as string,
      },
      message: "Image uploaded successfully",
    };
  } catch (error: any) {
    return {
      error: { base64Content: data },
      message: error.message,
    };
  }
};
