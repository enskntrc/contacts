import { Readable } from "node:stream";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { UploadHandler } from "@remix-run/node";

export const storage = new S3Client({
  forcePathStyle: true,
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

export const s3UploadHandler: UploadHandler = async ({
  data,
  filename,
  contentType,
}) => {
  if (!filename) {
    return "";
  }

  const stream = Readable.from(data);
  const upload = await new Upload({
    client: storage,
    leavePartsOnError: false,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: stream,
      ContentType: contentType,
    },
  }).done();

  if (upload.$metadata.httpStatusCode === 200) {
    return filename;
  }

  return upload.Location;
};
