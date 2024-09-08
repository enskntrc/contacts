import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);
const prefixes = {
  key: "key",
  api: "api",
  policy: "pol",
  request: "req",
  workspace: "ws",
  img: "img",
  keyAuth: "key_auth", // <-- this is internal and does not need to be short or pretty
  vercelBinding: "vb",
  test: "test", // <-- for tests only
} as const;

export function generateId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid(16)].join("_");
}

export const generateRandomFileName = (originalFileName: string) => {
  const fileExtension = originalFileName.split(".").pop();
  const randomString = generateId("img");
  return `${randomString}.${fileExtension}`;
};

export function getS3ImageUrl(path: string) {
  const isSSR = typeof window === "undefined";

  const S3_ENDPOINT = isSSR
    ? process.env.S3_ENDPOINT!
    : window.ENV.S3_ENDPOINT;

  const S3_BUCKET_NAME = isSSR
    ? process.env.S3_BUCKET_NAME!
    : window.ENV.S3_BUCKET_NAME;

  const baseURL = S3_ENDPOINT.replace(/\/s3$/, "");
  return `${baseURL}/object/public/${S3_BUCKET_NAME}/${path}`;
}
